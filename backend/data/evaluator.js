// ── Keyword map by question category ────────────────────────────
const KEYWORDS = {
  // JS
  'closures':       ['scope','lexical','outer','inner','function','variable','retain','access','reference'],
  'hoisting':       ['var','let','const','declaration','initialization','top','function','temporal dead zone'],
  'event loop':     ['call stack','callback queue','microtask','macrotask','web api','non-blocking','asynchronous'],
  'promises':       ['resolve','reject','then','catch','finally','async','await','pending','fulfilled'],
  'prototype':      ['prototype','chain','inherit','object','property','__proto__','Object.create'],
  'closure':        ['scope','lexical','outer','function','variable','retain','access'],
  'dom':            ['document','element','node','event','listener','parent','child','query'],
  'es6':            ['arrow','destructure','spread','rest','template','class','import','export','const','let'],

  // Python
  'decorators':     ['wrapper','function','@','syntax','higher order','modify','behaviour','return'],
  'generators':     ['yield','iterator','lazy','memory','next','iterable','range','infinite'],
  'gil':            ['global interpreter lock','thread','cpython','concurrent','parallel','io','cpu bound'],
  'comprehension':  ['list','dict','set','expression','filter','map','iterate','memory','generator'],
  'context manager':['with','enter','exit','resource','file','close','acquire','release'],

  // Java
  'oops':           ['class','object','inheritance','polymorphism','encapsulation','abstraction','method','override'],
  'collections':    ['list','map','set','arraylist','hashmap','iterator','generics','comparable'],
  'threads':        ['thread','runnable','synchronized','lock','deadlock','volatile','concurrent','sleep','wait'],
  'exception':      ['try','catch','finally','throw','throws','checked','unchecked','runtime','custom'],
  'jvm':            ['bytecode','classloader','heap','stack','garbage collection','jit','runtime'],
  'streams':        ['stream','filter','map','reduce','collect','lambda','pipeline','parallel','optional'],

  // C/C++
  'pointers':       ['pointer','address','memory','dereference','null','reference','stack','heap','dynamic'],
  'memory':         ['malloc','free','new','delete','stack','heap','leak','dangling','smart pointer'],
  'stl':            ['vector','map','set','queue','stack','iterator','algorithm','sort','find'],
  'inheritance':    ['base','derived','virtual','override','polymorphism','constructor','destructor','vtable'],
  'oop c++':        ['class','object','access specifier','public','private','protected','friend'],

  // React
  'virtual dom':    ['virtual','real','diff','reconciliation','fiber','render','update','change'],
  'hooks':          ['useState','useEffect','useCallback','useMemo','useRef','useContext','dependency','cleanup'],
  'redux':          ['store','action','reducer','dispatch','state','middleware','thunk','saga'],
  'lifecycle':      ['mount','unmount','update','componentDidMount','useEffect','cleanup','render'],
  'performance':    ['memo','useMemo','useCallback','lazy','suspense','code split','virtualize','profiler'],
  'context api':    ['context','provider','consumer','createContext','value','prop drilling'],

  // Node.js
  'event driven':   ['event','emitter','listener','callback','non-blocking','asynchronous','loop','queue'],
  'middleware':     ['next','request','response','express','route','pipeline','error','chain'],
  'authentication': ['jwt','token','passport','session','cookie','bcrypt','hash','verify','sign'],
  'clustering':     ['cluster','worker','master','cpu','core','fork','ipc','load balance'],
  'streams node':   ['readable','writable','transform','pipe','chunk','buffer','backpressure','event'],

  // TypeScript
  'types':          ['interface','type','generic','union','intersection','narrowing','any','unknown','never'],
  'generics':       ['generic','type parameter','constraint','reusable','flexible','T','K','V'],
  'decorators ts':  ['decorator','metadata','class','method','property','parameter','reflect'],
  'utility types':  ['Partial','Required','Pick','Omit','Readonly','Record','Exclude','Extract'],

  // SQL
  'joins':          ['inner','left','right','full','cross','on','condition','table','foreign key'],
  'indexes':        ['index','btree','hash','clustered','non-clustered','performance','scan','seek'],
  'normalization':  ['1NF','2NF','3NF','BCNF','redundancy','dependency','anomaly','decompose'],
  'transactions':   ['ACID','atomicity','consistency','isolation','durability','commit','rollback','lock'],
  'aggregate':      ['count','sum','avg','max','min','group by','having','distinct','window'],

  // MongoDB
  'schema':         ['schema','collection','document','field','embedded','reference','flexible','bson'],
  'aggregation':    ['pipeline','match','group','project','sort','lookup','unwind','facet'],
  'indexing':       ['index','compound','text','geospatial','performance','explain','hint','covered'],
  'replication':    ['replica set','primary','secondary','oplog','failover','election','read concern'],

  // DSA
  'big o':          ['O(n)','O(1)','O(log n)','O(n^2)','time complexity','space complexity','linear','constant'],
  'sorting':        ['bubble','merge','quick','heap','insertion','selection','O(n log n)','pivot','stable'],
  'graph':          ['vertex','edge','bfs','dfs','directed','undirected','weight','path','cycle'],
  'dynamic programming': ['memoization','tabulation','subproblem','optimal','overlapping','top-down','bottom-up'],
  'tree':           ['root','leaf','node','height','depth','binary','bst','balanced','traversal','inorder'],
  'linked list':    ['node','head','tail','pointer','singly','doubly','circular','traverse','insert'],
  'hash':           ['hash','bucket','collision','chaining','probing','load factor','O(1)','key','value'],
  'heap':           ['heap','max','min','priority queue','heapify','O(log n)','parent','child','root'],
  'trie':           ['prefix','character','root','autocomplete','word','path','insert','search'],
  'two pointer':    ['left','right','pointer','sorted','window','shrink','expand','meet','O(n)'],
  'recursion':      ['base case','recursive call','stack','depth','backtrack','divide','conquer'],

  // System Design
  'scalability':    ['horizontal','vertical','scale','load balancer','sharding','partition','cache','CDN'],
  'caching':        ['redis','cache','hit','miss','eviction','LRU','TTL','invalidate','write-through'],
  'microservices':  ['service','API gateway','discovery','circuit breaker','event bus','independent','deploy'],
  'cap theorem':    ['consistency','availability','partition','tolerance','CAP','tradeoff','distributed'],
  'message queue':  ['queue','kafka','rabbitmq','producer','consumer','async','decouple','retry'],
  'load balancing': ['round robin','least connection','IP hash','health check','sticky session','upstream'],
  'database design':['schema','normalization','denormalization','index','partition','replication','ACID'],
  'api design':     ['REST','GraphQL','versioning','idempotent','status code','pagination','rate limit','auth'],
  'rate limiting':  ['token bucket','leaky bucket','sliding window','counter','throttle','header','429'],
  'url shortener':  ['hash','encode','decode','redirect','collision','base62','analytics','expire'],

  // DevOps
  'docker':         ['container','image','dockerfile','volume','network','compose','registry','layer'],
  'kubernetes':     ['pod','node','cluster','deployment','service','ingress','namespace','helm','kubectl'],
  'ci/cd':          ['pipeline','build','test','deploy','artifact','trigger','jenkins','github actions'],
  'linux':          ['shell','permission','process','cron','systemd','grep','pipe','ssh','environment'],
  'monitoring':     ['log','metric','alert','prometheus','grafana','trace','uptime','SLA','SLO'],

  // Git
  'branching':      ['branch','merge','rebase','checkout','HEAD','main','feature','hotfix','flow'],
  'git commands':   ['commit','push','pull','fetch','clone','stash','reset','revert','cherry-pick'],
  'merge conflict': ['conflict','resolve','HEAD','incoming','current','manual','marker','accept'],
  'git flow':       ['main','develop','feature','release','hotfix','tag','version','merge'],

  // OS & Networking
  'process':        ['process','thread','context switch','scheduler','deadlock','race condition','semaphore'],
  'memory os':      ['virtual memory','paging','segmentation','page fault','swap','TLB','address space'],
  'networking':     ['TCP','UDP','HTTP','HTTPS','DNS','IP','port','socket','handshake','protocol'],
  'http':           ['GET','POST','PUT','DELETE','status','header','body','REST','CORS','cookie'],
  'dns':            ['domain','resolver','root','TLD','A record','CNAME','TTL','recursive','lookup'],

  // HR
  'behavioral':     ['situation','task','action','result','STAR','team','challenge','learned','outcome'],
  'conflict':       ['disagreed','communicated','listen','perspective','resolve','professional','compromise'],
  'leadership':     ['lead','initiative','mentor','decision','responsibility','delegate','inspire','own'],
  'failure':        ['failed','learned','improved','mistake','accountability','adapted','corrected'],
  'goals':          ['growth','senior','contribute','team','learn','challenge','technology','career'],
  'strength':       ['skill','experience','strength','achieve','impact','value','deliver','expertise'],
  'weakness':       ['weakness','improve','working on','learning','aware','steps','overcome','feedback'],
};

// ── Score answer ─────────────────────────────────────────────────
function evaluateAnswer(answer, question) {
  if (!answer || answer.trim().length < 8) {
    return { score: 0, feedback: '❌ No answer provided. Always attempt even a partial explanation — partial marks are available.', keywords: [] };
  }

  const lower     = answer.toLowerCase();
  const wordCount = answer.trim().split(/\s+/).length;

  // Find best keyword set for the question
  const qLower = question.q.toLowerCase();
  let bestKws = [];
  let bestHits = 0;
  Object.entries(KEYWORDS).forEach(([topic, kws]) => {
    if (qLower.includes(topic) || topic.split(' ').some(t => qLower.includes(t))) {
      const hits = kws.filter(k => lower.includes(k.toLowerCase())).length;
      if (hits > bestHits) { bestHits = hits; bestKws = kws; }
    }
  });
  // fallback: check question keywords list from question object
  const qKws = question.keywords || [];
  const matchedQKws = qKws.filter(k => lower.includes(k.toLowerCase()));
  if (matchedQKws.length > bestHits) { bestHits = matchedQKws.length; bestKws = qKws; }

  const matched  = bestKws.filter(k => lower.includes(k.toLowerCase()));
  const kwScore  = bestKws.length > 0 ? Math.round((matched.length / bestKws.length) * 45) : 20;
  const lenScore = wordCount < 15 ? 8 : wordCount < 40 ? 18 : wordCount < 80 ? 26 : 30;
  const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 5).length;
  const structScore = sentences >= 3 ? 25 : sentences === 2 ? 18 : sentences === 1 ? 10 : 5;

  const raw   = Math.min(100, kwScore + lenScore + structScore);
  const score = Math.max(5, raw);
  const feedback = buildFeedback(score, matched, bestKws, wordCount, question);

  return { score, feedback, keywords: matched.slice(0, 6) };
}

function buildFeedback(score, matched, expected, wordCount, question) {
  const lines = [];

  if      (score >= 88) lines.push('🌟 Outstanding answer! Excellent depth and clarity.');
  else if (score >= 75) lines.push('✅ Strong answer! You covered the key concepts well.');
  else if (score >= 58) lines.push('👍 Good attempt. You have the right idea but could go deeper.');
  else if (score >= 38) lines.push('⚠️  Partial answer. The core concept needs more explanation.');
  else                  lines.push('❌ The answer needs significant improvement. Review this topic.');

  if (wordCount < 30)
    lines.push('💡 Tip: Aim for 50–100 words. Interviewers want explanations, not one-liners.');

  const missed = expected.filter(k => !matched.map(m => m.toLowerCase()).includes(k.toLowerCase()));
  if (missed.length > 0 && score < 78)
    lines.push(`📌 Try to mention: ${missed.slice(0, 4).join(', ')}.`);

  if (question.tip)
    lines.push(`🎯 Interviewer tip: ${question.tip}`);

  return lines.join('  ');
}

function getGrade(score) {
  if (score >= 90) return { letter: 'A+', label: 'Outstanding',  color: '#06d6a0' };
  if (score >= 80) return { letter: 'A',  label: 'Excellent',    color: '#00c9a7' };
  if (score >= 70) return { letter: 'B+', label: 'Good',         color: '#60a5fa' };
  if (score >= 60) return { letter: 'B',  label: 'Average',      color: '#a78bfa' };
  if (score >= 48) return { letter: 'C',  label: 'Needs Work',   color: '#f59e0b' };
  if (score >= 35) return { letter: 'D',  label: 'Poor',         color: '#f97316' };
  return               { letter: 'F',  label: 'Failed',      color: '#ef4444' };
}

module.exports = { evaluateAnswer, getGrade };
