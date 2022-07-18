import { RadarMarker } from "../components/RadarMarker"
import { RadarLocations } from "./radarLocations.js";

/**
 * Render all radar markers
 * @returns all radar markers
 */
export const renderMarks = (selected, setSelected) => {
    const radarObjs = [];
    for(let radar in RadarLocations) {
        const [lat, lng] = RadarLocations[radar];
        radarObjs.push({radar, lat, lng});
    }
    return radarObjs.map((radarObj) => {
        return <RadarMarker 
            selected={selected}
            setSelected={setSelected}
            {...radarObj}
        />;
    })
}

/**
 * Filter out irrelevant radars
 * @param {Array<String>} radars   all selected radars
 * @param {Number} minLat          minLat of bounds
 * @param {Number} maxLat          maxLat of bounds
 * @param {Number} minLng          minLng of bounds
 * @param {Number} maxLng          maxLng of bounds
 * @returns {Array<String>} filtered radars
 */
export const filterRadars = (radars, minLat, maxLat, minLng, maxLng) => {
    return radars.filter((radar) => {
        const [lat, lng] = RadarLocations[radar];
        return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
    })
}