import './index.css';
import { Marker } from '@react-google-maps/api';

export const RadarMarker = (props) => {
    const {
        lat,
        lng,
        radar,
        selected,
        setSelected
    } = props;
    return <Marker 
        position={{
            lat,
            lng
        }}
        onClick={() => {
            if(selected !== radar) setSelected(radar);
            else setSelected("");
        }}
        icon={`http://maps.google.com/mapfiles/ms/icons/${selected === radar ? 'red' : 'blue'}.png`}
    />;
}