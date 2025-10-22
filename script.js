class MemoApp {
    constructor() {
        this.memos = JSON.parse(localStorage.getItem('memos')) || [];
        this.currentMemoId = null;
        
        this.initElements();
        this.bindEvents();
        this.loadMemoList();
    }
    
    initElements() {
        this.newBtn = document.getElementById('newBtn');
        this.saveBtn = document.getElementById('saveBtn');
        this.loadBtn = document.getElementById('loadBtn');
        this.deleteBtn = document.getElementById('deleteBtn');
        this.memoTitle = document.getElementById('memoTitle');
        this.memoContent = document.getElementById('memoContent');
        this.memoList = document.getElementById('memoList');
    }
    
    bindEvents() {
        this.newBtn.addEventListener('click', () => this.newMemo());
        this.saveBtn.addEventListener('click', () => this.saveMemo());
        this.deleteBtn.addEventListener('click', () => this.deleteMemo());
        
        // 자동 저장 (3초마다)
        setInterval(() => {
            if (this.currentMemoId && (this.memoTitle.value || this.memoContent.value)) {
                this.saveMemo(false);
            }
        }, 3000);
    }
    
    newMemo() {
        this.currentMemoId = null;
        this.memoTitle.value = '';
        this.memoContent.value = '';
        this.memoTitle.focus();
        this.updateActiveItem();
    }
    
    saveMemo(showAlert = true) {
        const title = this.memoTitle.value.trim() || '제목 없음';
        const content = this.memoContent.value.trim();
        
        if (!content && !this.memoTitle.value.trim()) {
            if (showAlert) alert('메모 내용을 입력해주세요.');
            return;
        }
        
        const memo = {
            id: this.currentMemoId || Date.now(),
            title: title,
            content: content,
            createdAt: this.currentMemoId ? 
                this.memos.find(m => m.id === this.currentMemoId)?.createdAt || new Date().toISOString() :
                new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        if (this.currentMemoId) {
            const index = this.memos.findIndex(m => m.id === this.currentMemoId);
            if (index !== -1) {
                this.memos[index] = memo;
            }
        } else {
            this.memos.unshift(memo);
            this.currentMemoId = memo.id;
        }
        
        this.saveMemos();
        this.loadMemoList();
        
        if (showAlert) {
            this.showNotification('메모가 저장되었습니다.');
        }
    }
    
    deleteMemo() {
        if (!this.currentMemoId) {
            alert('삭제할 메모를 선택해주세요.');
            return;
        }
        
        if (confirm('정말로 이 메모를 삭제하시겠습니까?')) {
            this.memos = this.memos.filter(m => m.id !== this.currentMemoId);
            this.saveMemos();
            this.loadMemoList();
            this.newMemo();
            this.showNotification('메모가 삭제되었습니다.');
        }
    }
    
    loadMemo(id) {
        const memo = this.memos.find(m => m.id === id);
        if (memo) {
            this.currentMemoId = id;
            this.memoTitle.value = memo.title;
            this.memoContent.value = memo.content;
            this.updateActiveItem();
        }
    }
    
    loadMemoList() {
        this.memoList.innerHTML = '';
        
        this.memos.forEach(memo => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 4px;">${memo.title}</div>
                <div style="font-size: 0.8rem; color: #666;">
                    ${new Date(memo.updatedAt).toLocaleDateString('ko-KR')}
                </div>
            `;
            li.addEventListener('click', () => this.loadMemo(memo.id));
            this.memoList.appendChild(li);
        });
        
        this.updateActiveItem();
    }
    
    updateActiveItem() {
        const items = this.memoList.querySelectorAll('li');
        items.forEach((item, index) => {
            item.classList.remove('active');
            if (this.currentMemoId && this.memos[index]?.id === this.currentMemoId) {
                item.classList.add('active');
            }
        });
    }
    
    saveMemos() {
        localStorage.setItem('memos', JSON.stringify(this.memos));
    }
    
    showNotification(message) {
        // 간단한 알림 표시
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 1rem;
            border-radius: 4px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    new MemoApp();
});