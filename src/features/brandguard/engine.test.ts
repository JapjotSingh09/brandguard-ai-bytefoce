import { describe, it, expect } from 'vitest';
import { analyze, correct, metrics, type Rule, type Submission } from './engine';
const rule = (values:Partial<Rule>):Rule=>({id:'r1',category:'Prohibited phrases',name:'Avoid guarantees',pattern:'guaranteed',replacement:'designed to',severity:'critical',explanation:'No absolute guarantees',...values});
describe('Traceable brand checks',()=>{
 it('detects prohibited terms case-insensitively with exact text and rule',()=>{const issues=analyze('GUARANTEED outcomes',[rule({})]);expect(issues).toHaveLength(1);expect(issues[0]).toMatchObject({ruleId:'r1',text:'GUARANTEED',start:0,end:10,severity:'critical'});});
 it('does not detect a phrase inside a longer word',()=>{expect(analyze('unguaranteed',[rule({})])).toEqual([]);});
 it('detects official terminology and supplies approved spelling',()=>{const issues=analyze('Welcome to Nova Tech',[rule({category:'Approved terminology',pattern:'Nova Tech',replacement:'NovaTech'})]);expect(correct('Welcome to Nova Tech',issues[0])).toBe('Welcome to NovaTech');});
 it('corrects a configured founding claim to 2018',()=>{const issue=analyze('NovaTech founded in 2015',[rule({category:'Approved facts',pattern:'founded in 2015',replacement:'founded in 2018'})])[0];expect(correct('NovaTech founded in 2015',issue)).toBe('NovaTech founded in 2018');});
 it('requires the configured disclaimer and appends it when accepted',()=>{const rr=rule({category:'Required disclaimers',pattern:'',replacement:'Product availability may vary by region.'});const issues=analyze('Meet NovaTech',[rr]);expect(issues).toHaveLength(1);expect(issues[0].start).toBe(-1);expect(analyze(correct('Meet NovaTech',issues[0]),[rr])).toEqual([]);});
 it('does not claim to automatically check visual identity or logos',()=>{expect(analyze('guaranteed',[rule({category:'Visual identity'}),rule({category:'Logo guidelines'})])).toEqual([]);});
 it('handles literal regex punctuation safely',()=>{expect(analyze('a+b',[rule({pattern:'a+b'})])[0].text).toBe('a+b');});
 it('counts decisions separately from outstanding changes',()=>{const rows=['Approved','Rejected','Awaiting review','Changes requested'].map(status=>({status,issues:[]} as unknown as Submission));expect(metrics(rows)).toEqual({total:4,pending:1,approved:1,rejected:1,violations:0});});
});
