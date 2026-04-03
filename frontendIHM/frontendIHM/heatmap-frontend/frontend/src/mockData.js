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
        air_temp: 44.0,
        land_surface_temp: 46.5,
        humidity: 62.0,
        uv_index: 10.5,
        green_cover_pct: 8.5,
        concrete_density: 88.0,
        population_density: 35000.0,
        citizen_reports: 12,
        interventions: [
            {name: "Red Alert Protocols", description: "Trigger SMS warnings.", cost:"20K", cooling: 0.0, timeline:"Immediate"}
        ]
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
        air_temp: 41.0,
        land_surface_temp: 42.0,
        humidity: 58.0,
        uv_index: 8.5,
        green_cover_pct: 12.0,
        concrete_density: 75.0,
        population_density: 28000.0,
        citizen_reports: 5,
        interventions: [
            {name: "Cool Roofs", description: "Paint reflective coatings.", cost:"3L", cooling: 1.5, timeline:"Short Term"}
        ]
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
        air_temp: 38.0,
        land_surface_temp: 39.5,
        humidity: 64.0,
        uv_index: 7.0,
        green_cover_pct: 35.0,
        concrete_density: 50.0,
        population_density: 15000.0,
        citizen_reports: 1,
        interventions: [
            {name: "Maintain Greenery", description: "Preserve trees.", cost:"10K", cooling: 0.5, timeline:"Ongoing"}
        ]
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