import express from 'express';
import Building from '../models/Building.js';
import Item from '../models/Item.js';

const router = express.Router();

// Получение всех зданий с количеством типов items
router.get('/', async (req, res) => {
    try {
        // Получаем все здания
        const buildings = await Building.find();

        // Для каждого здания считаем количество items по типам
        const buildingsWithItemCounts = await Promise.all(
            buildings.map(async (building) => {
                const itemCounts = await Item.aggregate([
                    {$match: {buildingId: building._id}}, // Сопоставляем `buildingId`
                    {$group: {_id: '$type', count: {$sum: 1}}} // Группируем по типу и считаем количество
                ]);
                // Преобразуем результат в удобный формат
                const itemCountMap = itemCounts.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {});
                return {
                    ...building.toObject(),
                    itemCounts: itemCountMap // Добавляем информацию о количестве items
                };
            })
        );
        res.status(200).json(buildingsWithItemCounts);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
});


// Возвращает список items для конкретного здания
router.get('/:buildingId/items', async (req, res) => {
    try {
        const {buildingId} = req.params;
        // Найти все items, связанные с buildingId
        const items = await Item.find({buildingId: buildingId});

        if (!items || items.length === 0) {
            return res.status(404).json({message: 'Items not found for this building'});
        }

        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
});

router.post('/create', async (req, res) => {
    try {
        console.log(req.body); // Посмотрим, что приходит
        const {name, location, image} = req.body;

        if (!name || !location || !image) {
            return res.status(400).json({message: 'All fields are required'});
        }

        const building = new Building({name, location, image});
        await building.save();

        res.status(201).json({message: 'Successfully created', building});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const {name, location, image} = req.body;

        if (!name || !location || !image) {
            return res.status(400).json({message: 'All fields are required'});
        }

        const updatedBuilding = await Building.findByIdAndUpdate(
            id,
            {name, location, image},
            {new: true, runValidators: true} // Возвращает обновленный объект и проверяет валидацию
        );

        if (!updatedBuilding) {
            return res.status(404).json({message: 'Building not found'});
        }

        res.status(200).json({message: 'Successfully updated', updatedBuilding});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
});

export default router;