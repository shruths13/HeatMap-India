const mockData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: 1,
        name: "T. Nagar",
        city: "Chennai",
        score: 9.2,
        risk: "DANGER",
        air_temp: 44,
        feels_like: 49,
        humidity: 62,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [80.230, 13.040],
          [80.245, 13.040],
          [80.245, 13.055],
          [80.230, 13.055],
          [80.230, 13.040],
        ]],
      },
    },
    {
      type: "Feature",
      properties: {
        id: 2,
        name: "Kodambakkam",
        city: "Chennai",
        score: 7.4,
        risk: "HIGH",
        air_temp: 41,
        feels_like: 45,
        humidity: 58,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [80.210, 13.045],
          [80.225, 13.045],
          [80.225, 13.060],
          [80.210, 13.060],
          [80.210, 13.045],
        ]],
      },
    },
    {
      type: "Feature",
      properties: {
        id: 3,
        name: "Adyar",
        city: "Chennai",
        score: 5.5,
        risk: "MODERATE",
        air_temp: 38,
        feels_like: 41,
        humidity: 64,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [80.255, 13.005],
          [80.270, 13.005],
          [80.270, 13.020],
          [80.255, 13.020],
          [80.255, 13.005],
        ]],
      },
    },
  ],
};

export default mockData;