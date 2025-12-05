const boardE1 = document.getElementById('board');
const cells = Array.from(document.querySelectorAll('.cell'));
const btnReset = document.getElementById('reset');
const turnEl = document.getElementById('turn');
const stateEl = document.getElementById('state');
// 新增計分板元素變數
const scoreXEl = document.getElementById('score-x');
const scoreOEl = document.getElementById('score-o');
const scoreDrawEl = document.getElementById('score-draw');
const btnResetAll = document.getElementById('reset-all');

// WIN_LINES 只保留一份 (避免重複定義)
const WIN_LINES = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6] // diags
];

// 變數宣告只保留一份
let board;
let current;
let active;
let scoreX = 0;
let scoreO = 0;
let scoreDraw = 0;


function init(){
    board = Array(9).fill('');
    current = 'X';
    active = true;
    cells.forEach(c=>{
        c.textContent = '';
        c.className = 'cell';
        c.disabled = false;
    });
    turnEl.textContent = current;
    stateEl.textContent = '';
    // 確保 init 時分數板也是最新的
    updateScoreboard(); 
}

function place(idx){
    if(!active || board[idx]) return;
    board[idx] = current;
    const cell = cells[idx];
    cell.textContent = current;
    cell.classList.add(current.toLowerCase());
    const result = evaluate();
    if(result.finished){
        endGame(result);
    }else{
        switchTurn();
    }
}

function switchTurn(){
    current = current === 'X' ? 'O' : 'X';
    turnEl.textContent = current;
}

function evaluate(){
    for(const line of WIN_LINES){
        const [a,b,c] = line;
        if(board[a] && board[a] === board[b] && board[a] === board[c]){
            return { finished:true, winner:board[a], line };
        }
    }
    if(board.every(v=>v)) return { finished:true, winner:null };
    return { finished:false };
}

// 這是您希望保留的、帶有計分邏輯的 endGame 函數 (修正標點符號)
function endGame({winner, line}){
    active = false;
    if(winner){
        stateEl.textContent = `${winner} 勝利！`; // 修正模板字串
        line.forEach(i=> cells[i].classList.add('win'));
        if(winner==='X') scoreX++; else scoreO++;
    }else{
        stateEl.textContent = '平手'; // 修正標點符號
        scoreDraw++;
    }
    updateScoreboard();
    cells.forEach(c=> c.disabled = true);
}

function updateScoreboard(){
    scoreXEl.textContent = scoreX;
    scoreOEl.textContent = scoreO;
    scoreDrawEl.textContent = scoreDraw;
}


// --- 事件監聽 (放在所有函數定義之後) ---

cells.forEach(cell=>{
    cell.addEventListener('click', ()=>{
        const idx = +cell.getAttribute('data-idx');
        place(idx);
    });
});

btnReset.addEventListener('click', init);

// 綁定事件：重置計分（連同遊戲）
btnResetAll.addEventListener('click', ()=>{
    scoreX = scoreO = scoreDraw = 0;
    updateScoreboard();
    init();
}); 
init();