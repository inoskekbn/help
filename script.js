// Фронтенд функционал для CyberKombat

class CyberKombatFrontend {
    constructor() {
        this.apiUrl = 'http://localhost:3000/api';
        this.init();
    }

    init() {
        this.loadStats();
        this.setupEventListeners();
    }

    // Загружаем статистику
    async loadStats() {
        try {
            const response = await fetch(`${this.apiUrl}/stats`);
            const stats = await response.json();
            
            // Обновляем отображение статистики если есть элементы
            const statsElement = document.getElementById('stats');
            if (statsElement) {
                statsElement.innerHTML = `
                    <div class="stat-item">
                        <div class="stat-number">${stats.visitors.toLocaleString()}+</div>
                        <p>посетителей</p>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${stats.orders}+</div>
                        <p>заказов</p>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${stats.revenue.toLocaleString()}₽</div>
                        <p>общий оборот</p>
                    </div>
                `;
            }
        } catch (error) {
            console.log('Статистика временно недоступна');
        }
    }

    // Создание заказа
    async createOrder(productName, price, customerData) {
        try {
            const orderData = {
                product: productName,
                price: price,
                customer: customerData,
                status: 'new'
            };

            const response = await fetch(`${this.apiUrl}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();
            
            if (result.success) {
                this.showNotification('Заказ успешно создан! Номер заказа: ' + result.orderId, 'success');
                return result;
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            this.showNotification('Ошибка при создании заказа: ' + error.message, 'error');
            console.error('Error creating order:', error);
        }
    }

    // Отправка сообщения через форму
    async sendContactMessage(formData) {
        try {
            const response = await fetch(`${this.apiUrl}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            
            if (result.success) {
                this.showNotification('Сообщение успешно отправлено!', 'success');
                return result;
            }
        } catch (error) {
            this.showNotification('Ошибка при отправке сообщения', 'error');
            console.error('Error sending message:', error);
        }
    }

    // Показать уведомление
    showNotification(message, type = 'info') {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = `cyber-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Добавляем стили
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(0, 243, 255, 0.9)' : 'rgba(255, 0, 60, 0.9)'};
            color: #000;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-family: 'Orbitron', sans-serif;
            font-weight: bold;
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Удаляем через 5 секунд
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    setupEventListeners() {
        // Добавляем анимацию при наведении на кнопки
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-3px)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
            });
        });

        // Обработка форм заказа
        document.querySelectorAll('[data-product]').forEach(button => {
            button.addEventListener('click', () => {
                const productName = button.getAttribute('data-product');
                const price = button.getAttribute('data-price');
                this.showOrderModal(productName, price);
            });
        });
    }

    showOrderModal(productName, price) {
        // Создаем модальное окно
        const modal = document.createElement('div');
        modal.className = 'cyber-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>ЗАКАЗ ${productName}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="orderForm">
                        <div class="form-group">
                            <label for="customerName">Имя</label>
                            <input type="text" id="customerName" required>
                        </div>
                        <div class="form-group">
                            <label for="customerEmail">Email</label>
                            <input type="email" id="customerEmail" required>
                        </div>
                        <div class="form-group">
                            <label for="customerPhone">Телефон</label>
                            <input type="tel" id="customerPhone" required>
                        </div>
                        <div class="form-group">
                            <label>Способ связи</label>
                            <select id="contactMethod">
                                <option value="phone">Телефон</option>
                                <option value="telegram">Telegram</option>
                                <option value="email">Email</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">ПОДТВЕРДИТЬ ЗАКАЗ</button>
                    </form>
                </div>
            </div>
        `;

        // Добавляем стили
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;

        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            background: var(--card-bg);
            padding: 2rem;
            border-radius: 15px;
            border: 2px solid var(--neon-blue);
            max-width: 500px;
            width: 90%;
        `;

        document.body.appendChild(modal);

        // Закрытие модального окна
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });

        // Обработка формы
        modal.querySelector('#orderForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const customerData = {
                name: document.getElementById('customerName').value,
                email: document.getElementById('customerEmail').value,
                phone: document.getElementById('customerPhone').value,
                contactMethod: document.getElementById('contactMethod').value
            };

            await this.createOrder(productName, price, customerData);
            document.body.removeChild(modal);
        });
    }
}

// Инициализация фронтенда при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.cyberKombat = new CyberKombatFrontend();
    
    // Добавляем стили для уведомлений
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
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .cyber-modal .form-group {
            margin-bottom: 1.5rem;
        }
        
        .cyber-modal label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--neon-blue);
            font-family: 'Orbitron', sans-serif;
        }
        
        .cyber-modal input,
        .cyber-modal select {
            width: 100%;
            padding: 0.8rem;
            background: var(--bg-primary);
            border: 2px solid var(--border-color);
            border-radius: 8px;
            color: var(--text-primary);
            font-family: 'Rajdhani', sans-serif;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }
        
        .close-modal {
            background: none;
            border: none;
            color: var(--neon-red);
            font-size: 2rem;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
});