export const mockedLocationsReal = [
  {
    _id: '5c4d6f900a39312330403245',
    name: "ג'ימבורי",
    location_id: 'D18',
    position: { floor: -1 },
    icon: 'gimbori.png',
    type: 'רגיל',
    image_id: '5c4d6f900a3931233040325f',
  },
  {
    _id: '5c4d6f900a3931233040325c',
    name: 'חדר הבעה ביצירה',
    location_id: 'D12',
    position: { floor: -1 },
    icon: '01354.png',
    type: 'רגיל',
    image_id: '5c4d6f900a3931233040325f',
  },
  {
    _id: '5c4d6f900a3931233040325b',
    name: 'חדר קלינאיות תקשורת',
    location_id: 'D15',
    position: { floor: -1 },
    icon: 'commuicatios.png',
    type: 'רגיל',
    image_id: '5c4d6f900a3931233040325f',
  },
];

export const mockedBlockReal = [
  { _id: '5c4da4574302182cccae3519', reason: 'D18', from: '5c4d6f900a3931233040325b', to: '5c4d6f900a3931233040325c' },
  { _id: '5c4da46a4302182cccae351a', reason: 'D12', from: '5c4d6f900a39312330403245', to: '5c4d6f900a3931233040325c' },
  { _id: '5c4da4774302182cccae351b', reason: 'D15', from: '5c4d6f900a3931233040325b', to: '5c4d6f900a39312330403245' },
];
