const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('../')); // Раздаем статические файлы

// Путь к файлу с заказами
const ORDERS_FILE = path.join(__dirname, 'orders.json');

// Инициализируем файл заказов, если его нет
if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
}

// Получить все заказы
app.get('/api/orders', (req, res) => {
    try {
        const data = fs.readFileSync(ORDERS_FILE, 'utf8');
        const orders = JSON.parse(data);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка чтения заказов' });
    }
});

// Создать новый заказ
app.post('/api/orders', (req, res) => {
    try {
        const newOrder = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...req.body
        };

        const data = fs.readFileSync(ORDERS_FILE, 'utf8');
        const orders = JSON.parse(data);
        orders.push(newOrder);
        
        fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
        
        res.status(201).json({
            success: true,
            message: 'Заказ успешно создан',
            orderId: newOrder.id
        });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка создания заказа' });
    }
});

// Получить информацию о компании
app.get('/api/info', (req, res) => {
    const companyInfo = {
        name: 'CyberKombat',
        founded: 2020,
        location: 'Москва, Россия',
        description: 'Ведущий производитель игровых компьютеров в стиле киберпанк',
        stats: {
            systemsBuilt: 1000,
            esportsTeams: 50,
            satisfactionRate: 99
        },
        contacts: {
            phone: '+7 (495) 123-45-67',
            email: 'info@cyberkombat.ru',
            address: 'г. Москва, ул. Киберпанк, 42'
        }
    };
    res.json(companyInfo);
});

// Статистика сайта
app.get('/api/stats', (req, res) => {
    const stats = {
        visitors: Math.floor(Math.random() * 10000) + 5000,
        orders: Math.floor(Math.random() * 500) + 100,
        revenue: Math.floor(Math.random() * 10000000) + 5000000
    };
    res.json(stats);
});

// Обработка формы обратной связи
app.post('/api/contact', (req, res) => {
    const { name, email, phone, message } = req.body;
    
    // Здесь можно добавить логику отправки email или сохранения в БД
    console.log('Новое сообщение:', { name, email, phone, message });
    
    res.json({
        success: true,
        message: 'Сообщение успешно отправлено',
        timestamp: new Date().toISOString()
    });
});

// Получить продукты
app.get('/api/products', (req, res) => {
    const products = [
        {
            id: 1,
            name: 'Cyber Ninja',
            price: 329999,
            specs: [
                'RTX 4090 24GB GDDR6X',
                'Intel Core i9-14900K',
                '64GB DDR5 RAM 6400MHz',
                '2TB NVMe SSD Gen5'
            ]
        },
        {
            id: 2,
            name: 'Fatality Edition',
            price: 279999,
            specs: [
                'RTX 4080 SUPER 16GB',
                'AMD Ryzen 9 7950X3D',
                '32GB DDR5 RAM 6000MHz',
                '4TB NVMe SSD RAID 0'
            ]
        },
        {
            id: 3,
            name: 'Cyber Scorpion',
            price: 199999,
            specs: [
                'RTX 4070 Ti SUPER 16GB',
                'Intel Core i7-14700K',
                '32GB DDR5 RAM 5600MHz',
                '2TB NVMe SSD Gen4'
            ]
        }
    ];
    
    res.json(products);
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log('Доступные эндпоинты:');
    console.log('  GET  /api/orders     - все заказы');
    console.log('  POST /api/orders     - создать заказ');
    console.log('  GET  /api/info       - информация о компании');
    console.log('  GET  /api/stats      - статистика сайта');
    console.log('  POST /api/contact    - отправка сообщения');
    console.log('  GET  /api/products   - список продуктов');
});