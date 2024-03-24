const mapServer = [
  'http://mapss.local/cache_qgiss?service=WMS&request=GetMap&layers=all_road_obj&styles=&format=image%2Fpng&transparent=true&version=1.3.0&width=256&height=256&crs=EPSG%3A3857&bbox=3367509.718131725,6483694.487261791,3368121.2143580066,6484305.98348807',
  'http://mapss.local/cache_qgiss?service=WMS&request=GetMap&layers=all_road_obj&styles=&format=image%2Fpng&transparent=true&version=1.3.0&width=256&height=256&crs=EPSG%3A3857&bbox=3367509.718131725,6483694.487261791,3368121.2143580066,6484305.98348807',
  'http://mapss.local/cache_qgiss?service=WMS&request=GetMap&layers=all_road_obj&styles=&format=image%2Fpng&transparent=true&version=1.3.0&width=256&height=256&crs=EPSG%3A3857&bbox=3369955.703036851,6483694.487261791,3370567.1992631326,6484305.983488073',
  'http://mapss.local/cache_qgiss?service=WMS&request=GetMap&layers=all_road_obj&styles=&format=image%2Fpng&transparent=true&version=1.3.0&width=256&height=256&crs=EPSG%3A3857&bbox=3363840.740774037,6476968.028772698,3364452.2370003182,6477579.524998978',
  'http://mapss.local/cache_qgiss?service=WMS&request=GetMap&layers=all_road_obj&styles=&format=image%2Fpng&transparent=true&version=1.3.0&width=256&height=256&crs=EPSG%3A3857&bbox=3363229.2445477555,6457400.14953169,3365675.229452881,6459846.134436822',
];

async function fetchData(url) {
  const startTime = performance.now();
  const response = await fetch(url);
  const endTime = performance.now();
  const elapsedTime = endTime - startTime;
  return elapsedTime;
}

async function fetchAndCalculateStatistics(urls, repetitions) {
  const responseTimes = [];

  for (const url of urls) {
    for (let i = 0; i < repetitions; i++) {
      const time = await fetchData(url);
      responseTimes.push(time);
    }
  }

  const minTime = Math.min(...responseTimes);
  const maxTime = Math.max(...responseTimes);
  const sum = responseTimes.reduce((acc, curr) => acc + curr, 0);
  const avgTime = sum / responseTimes.length;

  console.log('Minimum Time:', minTime.toFixed(2), 'milliseconds');
  console.log('Maximum Time:', maxTime.toFixed(2), 'milliseconds');
  console.log('Average Time:', avgTime.toFixed(2), 'milliseconds');
}

const repetitions = 3;

fetchAndCalculateStatistics(mapServer, repetitions);
