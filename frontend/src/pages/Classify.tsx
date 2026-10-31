import { useState } from 'react';
import { ArrowRight, BrainCircuit, Check, Copy, FileText, RotateCcw, ScanText, Sparkles, ShieldAlert, GitCompareArrows } from 'lucide-react';
import { api } from '../services/api';
import type { ClassificationResult, Experiment } from '../types/api';
import { Panel, SectionHead, State } from '../components/UI';

const examples = [
  'Engine vibration increased during operation.',
  'The aircraft experienced unstable idle RPM during run-up.',
  'Technician noted no unusual bearing noise during routine inspection.',
  'Engine shutdown unexpectedly during flight operations and required immediate inspection.'
];

function Description({ result }: { result: ClassificationResult }) {
  return <div className="annotation-banner" role="note">
    <ShieldAlert size={18} aria-hidden="true" />
    <div><strong>Dataset annotation — not a safety verdict</strong>
      <span>{result.safety_interpretation || 'OK and DIFFICULT are labels from an aviation maintenance logbook. OK does not mean safe, normal, or operationally approved.'}</span>
    </div>
  </div>;
}

export default function Classify() {
  const [text, setText] = useState('');
  const [experiment, setExperiment] = useState<Experiment>('02');
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [comparison, setComparison] = useState<ClassificationResult[] | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [copied, setCopied] = useState(false);
  const resetOutput = () => { setResult(null); setComparison(null); setError(''); };
  const submit = async () => {
    setBusy(true); resetOutput();
    try { setResult((await api.classify(text.trim(), experiment)).result); }
    catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    finally { setBusy(false); }
  };
  const compare = async () => {
    setComparing(true); resetOutput();
    try {
      const [base, improved] = await Promise.all([api.classify(text.trim(), '01'), api.classify(text.trim(), '02')]);
      setComparison([base.result, improved.result]);
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    finally { setComparing(false); }
  };
  const copy = async () => {
    if (!result) return;
    try { await navigator.clipboard.writeText(JSON.stringify(result, null, 2)); setCopied(true); window.setTimeout(() => setCopied(false), 1500); }
    catch { setError('Clipboard access unavailable. Try copying the API JSON from Swagger.'); }
  };
  return <>
    <SectionHead eyebrow="NATURAL LANGUAGE PROCESSING / RESEARCH" title="Understand a maintenance note." description="Explore aviation logbook PROBLEM_TYPE annotations. These predictions do not diagnose machine faults or determine operational safety." />
    <div className="two-col">
      <Panel title="New classification" subtitle="Analyze one maintenance note at a time">
        <div className="field-head"><label htmlFor="note">Maintenance description</label><span>{text.length} / 5,000</span></div>
        <textarea id="note" rows={9} className="text-input" maxLength={5000} value={text} onChange={e => { setText(e.target.value); resetOutput(); }} placeholder="e.g. Engine vibration increased during operation..." />
        <div className="field-head field-experiment"><label>Model experiment</label><span>Research version</span></div>
        <div className="segmented" role="group" aria-label="Choose experiment">
          <button aria-pressed={experiment === '02'} className={experiment === '02' ? 'selected' : ''} onClick={() => { setExperiment('02'); resetOutput(); }}>Experiment 02<span>Character TF-IDF</span></button>
          <button aria-pressed={experiment === '01'} className={experiment === '01' ? 'selected' : ''} onClick={() => { setExperiment('01'); resetOutput(); }}>Experiment 01<span>Baseline</span></button>
        </div>
        {error && <State kind="error">{error}</State>}
        <div className="form-actions">
          <button className="btn btn-ghost" onClick={() => { setText(''); resetOutput(); }}><RotateCcw size={16} /> Clear</button>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button className="btn btn-muted" disabled={busy || comparing || text.trim().length < 3} onClick={() => void compare()}><GitCompareArrows size={16} /> Compare 01 vs 02</button>
            <button className="btn btn-primary" disabled={busy || comparing || text.trim().length < 3} onClick={() => void submit()}><ScanText size={17} />{busy ? 'Analyzing...' : 'Analyze note'}<ArrowRight size={16} /></button>
          </div>
        </div>
        <div className="examples"><span>TRY AN EXAMPLE — output is not a safety decision</span>{examples.map(s => <button key={s} onClick={() => { setText(s); resetOutput(); }}><Sparkles size={14} />{s}</button>)}</div>
      </Panel>
      <div className="right-stack">
        <Panel title="Classification result" subtitle="Real predictions from locally loaded artifacts">
          {result ? <div className="result-area">
            <div className="result-eyebrow">RESEARCH MODEL OUTPUT <span>EXP {result.experiment}</span></div>
            <p className="research-note" style={{ marginTop: 16 }}>Predicted <strong>logbook PROBLEM_TYPE</strong></p>
            <div className="result-label result-neutral">{result.label}</div>
            <Description result={result} />
            <p className="result-desc">A high or low score does not establish the physical cause or severity of a failure. For safety-critical incidents, follow appropriate inspection and escalation procedures regardless of this label.</p>
            <div className="result-rows">
              <div><span>Positive class</span><b>{result.positive_label || 'Not exposed (Exp 01)'}</b></div>
              <div><span>Positive class score</span><b>{result.positive_score === null ? 'Not available' : result.positive_score.toFixed(4)}</b></div>
              <div><span>Decision threshold</span><b>{result.decision_threshold === null ? 'Not exposed' : result.decision_threshold.toFixed(4)}</b></div>
              <div><span>Score interpretation</span><b>{result.score_kind.replaceAll('_', ' ')}</b></div>
            </div>
            <button className="btn btn-muted result-copy" onClick={() => void copy()}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy JSON result'}</button>
          </div> : comparison ? <div className="result-area">
            <div className="result-eyebrow">SIDE-BY-SIDE EXPERIMENT COMPARISON</div>
            <table className="compare-table"><thead><tr><th>Experiment</th><th>Logbook label</th><th>Score</th><th>Threshold</th></tr></thead><tbody>
              {comparison.map(item => <tr key={item.experiment}><td>{item.experiment}</td><td><strong>{item.label}</strong></td><td>{item.positive_score === null ? '—' : item.positive_score.toFixed(4)}</td><td>{item.decision_threshold === null ? '—' : item.decision_threshold.toFixed(4)}</td></tr>)}
            </tbody></table>
            <Description result={comparison[0]} />
            <p className="compare-explanation">Experiment 01 does not expose a comparable positive-class score. Agreement between two models does not validate safety or root cause.</p>
          </div> : <div className="result-empty"><div className="empty-symbol"><FileText size={36} /></div><h3>{comparing ? 'Comparing experiments...' : 'Your result will appear here'}</h3><p>Enter a maintenance note, then classify or compare two research versions.</p></div>}
        </Panel>
        <div className="caution"><BrainCircuit size={20} /><div><b>Model limitations</b><p>The training target is an imbalanced aviation logbook annotation (OK / DIFFICULT). Scores are not calibrated probabilities of failure. This application is not a safety monitoring or machine diagnosis system.</p></div></div>
      </div>
    </div>
  </>;
}
