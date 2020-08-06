const MAX_ZOOM_LEVEL = 9;

export const heatmapLayer = {
  maxzoom: MAX_ZOOM_LEVEL,
  type: 'heatmap',
  paint: {
    'heatmap-weight': ['interpolate', ['linear'], ['get', 'mag'], 0, 0, 100000, 1],
    'heatmap-intensity': 2,
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0,
      'rgba(33,102,172,0)',
      0.2,
      'rgba(103,169,207,0.2)',
      0.4,
      'rgba(209,229,240,0.4)',
      0.6,
      'rgba(253,219,199,0.6)',
      0.8,
      'rgba(239,138,98,0.8)',
      0.9,
      'rgba(255,201,101,1)'
    ],
    'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 10, 5, 15, 6, 30, 8, 50, MAX_ZOOM_LEVEL, 100],
    'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 1, 10, 1, 11, 1]
  }
};