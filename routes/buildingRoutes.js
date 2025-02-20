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


export default router;