import React from 'react';
import ReactDOM from 'react-dom/client';
import { Map } from './components/Map';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Map />
);

// ssh -i "~/.ssh/nexrad-demo-key-pair.pem" ec2-user@ec2-18-216-128-50.us-east-2.compute.amazonaws.com
