class NewsApp {
    constructor() {
        this.news = JSON.parse(localStorage.getItem('news')) || [];
        this.form = document.getElementById('newsForm');
        this.imageInput = document.getElementById('image');
        this.imagePreview = document.getElementById('imagePreview');
        this.newsContainer = document.getElementById('newsContainer');
        
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.imageInput.addEventListener('change', (e) => this.previewImage(e));
        
        this.renderNews();
    }

    previewImage(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const imageFile = this.imageInput.files[0];
        
        if (!title || !content || !imageFile) return;

        // Simulate upload
        this.uploadBtn.disabled = true;
        this.uploadBtn.innerHTML = '<span>⏳ Mengupload...</span>';

        // Convert image to base64
        const reader = new FileReader();
        reader.onload = () => {
            const newsItem = {
                id: Date.now(),
                title,
                content,
                image: reader.result,
                date: new Date().toLocaleString('id-ID')
            };

            this.news.unshift(newsItem);
            localStorage.setItem('news', JSON.stringify(this.news));
            this.renderNews();
            
            // Reset form
            this.form.reset();
            this.imagePreview.innerHTML = '';
            this.uploadBtn.disabled = false;
            this.uploadBtn.innerHTML = '<span>🚀 Upload Berita</span>';
            
            // Show success message
            this.showNotification('Berita berhasil diupload!');
        };
        reader.readAsDataURL(imageFile);
    }

    renderNews() {
        this.newsContainer.innerHTML = '';
        
        this.news.forEach((item, index) => {
            const newsEl = document.createElement('div');
            newsEl.className = 'news-item';
            newsEl.style.animationDelay = `${index * 0.1}s`;
            
            newsEl.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="news-title">${item.title}</div>
                <div class="news-content">${item.content}</div>
                <small style="opacity: 0.7; display: block; margin-top: 12px;">${item.date}</small>
            `;
            
            this.newsContainer.appendChild(newsEl);
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #10b981, #34d399);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
            z-index: 1000;
            font-weight: 500;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    new NewsApp();
});

// Add some sample data if empty
if (!localStorage.getItem('news')) {
    localStorage.setItem('news', JSON.stringify([]));
}
