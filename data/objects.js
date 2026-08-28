```javascript
// REZ Telescope VM V2 PRO
// Celestial object database for the simulator

const CELESTIAL_OBJECTS = [
  {
    id: "moon",
    name: "Moon",
    type: "Moon",
    ra: 14.2,
    dec: -12.1,
    az: 130,
    alt: 52,
    magnitude: -12.6
  },

  {
    id: "sun",
    name: "Sun",
    type: "Star",
    ra: 10.5,
    dec: 12.4,
    az: 160,
    alt: 48,
    magnitude: -26.7
  },

  {
    id: "mercury",
    name: "Mercury",
    type: "Planet",
    ra: 11.2,
    dec: 8.4,
    az: 175,
    alt: 41,
    magnitude: 1.2
  },

  {
    id: "venus",
    name: "Venus",
    type: "Planet",
    ra: 12.8,
    dec: 7.1,
    az: 195,
    alt: 56,
    magnitude: -4.2
  },

  {
    id: "mars",
    name: "Mars",
    type: "Planet",
    ra: 6.8,
    dec: 23.4,
    az: 210,
    alt: 38,
    magnitude: 1.0
  },

  {
    id: "jupiter",
    name: "Jupiter",
    type: "Planet",
    ra: 2.1,
    dec: 11.8,
    az: 265,
    alt: 47,
    magnitude: -2.4
  },

  {
    id: "saturn",
    name: "Saturn",
    type: "Planet",
    ra: 21.4,
    dec: -16.2,
    az: 310,
    alt: 34,
    magnitude: 0.8
  },

  {
    id: "andromeda",
    name: "Andromeda Galaxy",
    type: "Galaxy",
    ra: 0.712,
    dec: 41.269,
    az: 82,
    alt: 61,
    magnitude: 3.44
  },

  {
    id: "orion",
    name: "Orion Nebula",
    type: "Nebula",
    ra: 5.588,
    dec: -5.391,
    az: 120,
    alt: 43,
    magnitude: 4.0
  },

  {
    id: "pleiades",
    name: "Pleiades",
    type: "Open Cluster",
    ra: 3.79,
    dec: 24.12,
    az: 145,
    alt: 57,
    magnitude: 1.6
  },

  {
    id: "polaris",
    name: "Polaris",
    type: "Star",
    ra: 2.53,
    dec: 89.26,
    az: 0,
    alt: 34,
    magnitude: 1.98
  },

  {
    id: "vega",
    name: "Vega",
    type: "Star",
    ra: 18.62,
    dec: 38.78,
    az: 70,
    alt: 65,
    magnitude: 0.03
  },

  {
    id: "sirius",
    name: "Sirius",
    type: "Star",
    ra: 6.75,
    dec: -16.72,
    az: 155,
    alt: 29,
    magnitude: -1.46
  },

  {
    id: "betelgeuse",
    name: "Betelgeuse",
    type: "Star",
    ra: 5.92,
    dec: 7.41,
    az: 125,
    alt: 49,
    magnitude: 0.42
  },

  {
    id: "rigel",
    name: "Rigel",
    type: "Star",
    ra: 5.24,
    dec: -8.2,
    az: 135,
    alt: 40,
    magnitude: 0.13
  }
];


// Search objects by name or type
function searchObjects(query) {
  const q = query.toLowerCase().trim();

  if (!q) {
    return CELESTIAL_OBJECTS;
  }

  return CELESTIAL_OBJECTS.filter(object =>
    object.name.toLowerCase().includes(q) ||
    object.type.toLowerCase().includes(q)
  );
}


// Find an object by ID
function getObjectById(id) {
  return CELESTIAL_OBJECTS.find(object => object.id === id);
}


// Find an object by name
function getObjectByName(name) {
  return CELESTIAL_OBJECTS.find(
    object => object.name.toLowerCase() === name.toLowerCase()
  );
}
```
