import React, { useState, useCallback, memo, useEffect  } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import './index.css';
import { renderMarks } from '../../lib/util';
import { ReactComponent as RadarSVG } from '../../lib/radar.svg';
import { ReactComponent as Loading } from '../../lib/loading.svg';
import { ReactComponent as Error } from '../../lib/error.svg';
import axios from 'axios';

// https://github.com/netlify/cli/issues/158#issuecomment-540140129

let INIT_LAT = 39.96637466982237;
let INIT_LNG = -96.54152204152994;
let INIT_ZOOM = 5;

export const radars = [];

export const Map = memo((props) => {
  const { isLoaded } = useJsApiLoader({
    id: 'nexrad-google-map',
    googleMapsApiKey: process.env.REACT_APP_MAP_KEY
  })

  const [selected, setSelected] = useState("");
  const [map, setMap] = useState(null);
  const [freeze, setFreeze] = useState(false);
  const [imgPath, setImgPath] = useState("");

  useEffect(() => {
    const onWindowMouseDown = () => {
      setFreeze(false);
    }
    if(freeze) {
      window.addEventListener('mousedown', onWindowMouseDown);
    }
    else {
      window.removeEventListener('mousedown', onWindowMouseDown);
      setImgPath('');
    }
  }, [freeze]);

  const onLoad = useCallback(function callback(map) {
    map.setZoom(INIT_ZOOM)
    setMap(map)
  }, [])

  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])

  const plot = async () => {
    INIT_LAT = map?.getCenter()?.lat();
    INIT_LNG = map?.getCenter()?.lng();
    INIT_ZOOM =  map?.getZoom();
    const filteredRadars = selected === "" ? [] : [selected];
    const mapType = map?.getMapTypeId();
    const lat = map?.getCenter()?.lat();
    const lng = map?.getCenter()?.lng();
    const zoom = map?.getZoom();
    setFreeze(true);
    try {
      const res = await axios.post(process.env.REACT_APP_HOST_NAME + '/plot', { lat, lng, zoom, mapType, filteredRadars });
      if(res.status !== 200) setImgPath('error');
      else setImgPath(`${process.env.REACT_APP_HOST_NAME}/${res.data.fileName}.png`);
    } catch(e) {
      setImgPath('error');
    }
  }

  return isLoaded ? <>
      <GoogleMap
        center={{
          lat: INIT_LAT,
          lng: INIT_LNG
        }}
        zoom={INIT_ZOOM}
        onLoad={onLoad}
        onUnmount={onUnmount}
        mapContainerStyle={{
          height: "100vh",
          width: "100%",
        }}
        options={{
          fullscreenControl: false,
          streetViewControl: false,
        }}
        onBoundsChanged={() => {
          INIT_LAT = map?.getCenter()?.lat();
          INIT_LNG = map?.getCenter()?.lng();
          INIT_ZOOM =  map?.getZoom();
        }}
      >
        {renderMarks(selected, setSelected)}
        <RadarSVG 
          className='radar-svg'
          onClick={plot}
        />
        {freeze && <div
          className='freeze'
        ></div>}
        {freeze && <div
          className='plot'
        >
          {imgPath === '' && <Loading className='loading'/>}
          {imgPath === 'error' && <Error />}
          {imgPath !== '' && imgPath !== 'error' && <img src={imgPath} className='image' alt='radar-image'/>}
        </div>}
      </GoogleMap>
  </> : <></>
});