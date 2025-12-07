document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const newTodoInput = document.getElementById('new-todo');
    const addButton = document.getElementById('add-button');
    const todoList = document.getElementById('todo-list');
    const completedList = document.getElementById('completed-list');
    const fireworksContainer = document.getElementById('fireworks-container');

    // ToDoデータを保存する配列 (初期データも可能)
    let todos = loadTodos();

    // イベントリスナーの設定
    addButton.addEventListener('click', addTodo);
    newTodoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    // 最初にリストを描画
    renderTodos();

    /**
     * ローカルストレージからToDoデータを読み込む
     * @returns {Array} ToDoアイテムの配列
     */
    function loadTodos() {
        const storedTodos = localStorage.getItem('todos');
        return storedTodos ? JSON.parse(storedTodos) : [];
    }

    /**
     * ローカルストレージにToDoデータを保存する
     */
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    /**
     * ToDoリスト項目をHTMLに描画する (Read処理)
     */
    function renderTodos() {
        // リストをクリア
        todoList.innerHTML = '';
        completedList.innerHTML = '';

        // 未完了と完了済みを分けて描画
        todos.forEach((todo, index) => {
            const listItem = document.createElement('li');
            listItem.classList.add('todo-item');
            
            // 完了済みであればcompleted-itemクラスを追加
            if (todo.completed) {
                listItem.classList.add('completed-item');
                // 達成リストに追加
                listItem.innerHTML = `
                    <span class="todo-text">${todo.text}</span>
                    <div class="todo-controls">
                        <button class="delete-button" data-index="${index}">削除</button>
                    </div>
                `;
                completedList.appendChild(listItem);

            } else {
                // やることリストに追加
                listItem.innerHTML = `
                    <span class="todo-text">${todo.text}</span>
                    <div class="todo-controls">
                        <button class="check-button" data-index="${index}">チェック</button>
                        <button class="delete-button" data-index="${index}">削除</button>
                    </div>
                `;
                todoList.appendChild(listItem);
            }
        });

        // イベントリスナーを再設定
        attachEventListeners();
    }

    /**
     * ToDoリストに対するイベントリスナーを付与する
     */
    function attachEventListeners() {
        // チェックボタン (Update処理)
        document.querySelectorAll('.check-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                toggleComplete(index);
            });
        });

        // 削除ボタン (Delete処理)
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                deleteTodo(index);
            });
        });
    }

    /**
     * 新しいToDo項目を追加する (Create処理)
     */
    function addTodo() {
        const text = newTodoInput.value.trim();
        if (text) {
            todos.push({ text: text, completed: false });
            newTodoInput.value = ''; // 入力欄をクリア
            saveTodos();
            renderTodos();
        } else {
            alert("ToDo内容を入力してください。");
        }
    }

    /**
     * ToDo項目の完了/未完了を切り替える (Update処理)
     * @param {number} index - ToDo配列のインデックス
     */
    function toggleComplete(index) {
        // 未完了の項目だけを対象に操作
        if (!todos[index].completed) {
            todos[index].completed = true;
            // 花火エフェクトを表示
            showFireworks();
        }
        
        saveTodos();
        renderTodos();
    }

    /**
     * ToDo項目を削除する (Delete処理)
     * @param {number} index - ToDo配列のインデックス
     */
    function deleteTodo(index) {
        // 確認ダイアログ
        if(confirm(`"${todos[index].text}" を削除しますか？`)) {
             todos.splice(index, 1);
             saveTodos();
             renderTodos();
        }
    }

    /**
     * 完了時に花火のエフェクトを表示する
     */
    function showFireworks() {
        const numFireworks = 5;
        for (let i = 0; i < numFireworks; i++) {
            // ランダムな位置を決定
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const color = `hsl(${Math.random() * 360}, 100%, 50%)`; // ランダムな色

            // 花火の破片を複数作成
            for (let j = 0; j < 15; j++) {
                const firework = document.createElement('div');
                firework.classList.add('firework');
                firework.style.left = `${x}px`;
                firework.style.top = `${y}px`;
                firework.style.backgroundColor = color;
                
                // 拡散するアニメーション (CSSで定義)
                const angle = Math.random() * 360;
                const distance = Math.random() * 80 + 30; // 30pxから110pxの距離
                
                firework.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translate(${distance}px)`;
                firework.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
                
                fireworksContainer.appendChild(firework);

                // アニメーション終了後に要素を削除
                setTimeout(() => {
                    firework.remove();
                }, 800);
            }
        }
    }
});