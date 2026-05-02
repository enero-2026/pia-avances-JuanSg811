import { Colors } from './colors';

export const DEFAULT_CATEGORIES = [
  {
    id: 'transport',
    name: 'Transporte',
    icon: 'car',
    color: Colors.transport,
    bgColor: 'rgba(79, 142, 247, 0.15)',
  },
  {
    id: 'food',
    name: 'Comida',
    icon: 'restaurant',
    color: Colors.food,
    bgColor: 'rgba(247, 147, 79, 0.15)',
  },
  {
    id: 'school',
    name: 'Escuela',
    icon: 'school',
    color: Colors.school,
    bgColor: 'rgba(155, 89, 247, 0.15)',
  },
  {
    id: 'health',
    name: 'Salud',
    icon: 'medical',
    color: Colors.health,
    bgColor: 'rgba(0, 212, 170, 0.15)',
  },
  {
    id: 'entertainment',
    name: 'Entretenimiento',
    icon: 'game-controller',
    color: Colors.entertainment,
    bgColor: 'rgba(247, 201, 72, 0.15)',
  },
  {
    id: 'shopping',
    name: 'Compras',
    icon: 'cart',
    color: Colors.shopping,
    bgColor: 'rgba(247, 90, 90, 0.15)',
  },
  {
    id: 'other',
    name: 'Otros',
    icon: 'ellipsis-horizontal',
    color: Colors.other,
    bgColor: 'rgba(138, 155, 190, 0.15)',
  },
];

export const getCategoryById = (id, customCategories = []) => {
  const all = [...DEFAULT_CATEGORIES, ...customCategories];
  return all.find((c) => c.id === id) || DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1];
};
