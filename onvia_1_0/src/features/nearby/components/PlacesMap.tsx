import React from "react";
import { Platform, View } from "react-native";
import { WebView } from "react-native-webview";
import { Place } from "../../../domain/models";
import { t } from "../../../locales";
export function PlacesMap({
  items,
  center,
  onDirections,
}: {
  items: Place[];
  center: [number, number];
  onDirections: (place: Place) => void;
}) {
  const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"><style>html,body,#map{height:100%;margin:0;background:#e7ece7} .leaflet-popup-content{font:14px/1.6 sans-serif}a{color:#1932db}.pin{background:#1932db;border:3px solid white;border-radius:50%;box-shadow:0 3px 10px #0003;color:white;text-align:center;font:bold 19px/30px sans-serif}.pharmacy{background:#167468}</style></head><body><div id="map"></div><script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script><script>const map=L.map('map').setView(${JSON.stringify(center)},13);L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',maxZoom:19}).addTo(map);const items=${JSON.stringify(items).replace(/</g, "\\u003c")};items.forEach(p=>{const box=document.createElement('div');const title=document.createElement('strong');title.textContent=p.name;box.appendChild(title);box.appendChild(document.createElement('br'));const link=document.createElement('a');link.textContent=${JSON.stringify(t("nearby.destination"))};link.href='https://www.google.com/maps/dir/?api=1&destination='+p.latitude+','+p.longitude;link.target='_blank';link.onclick=function(e){if(window.ReactNativeWebView){e.preventDefault();window.ReactNativeWebView.postMessage(p.id)}};box.appendChild(link);L.marker([p.latitude,p.longitude],{icon:L.divIcon({className:'pin '+p.type,html:p.type==='hospital'?'+':'✚',iconSize:[30,30]})}).addTo(map).bindPopup(box)});L.circleMarker(${JSON.stringify(center)},{radius:7,color:'#fff',weight:3,fillColor:'#1932db',fillOpacity:1}).addTo(map).bindPopup(${JSON.stringify(t("nearby.center"))});</script></body></html>`;
  return (
    <View
      style={{
        height: 340,
        borderRadius: 16,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#DDDCD5",
      }}
    >
      {Platform.OS === "web" ? (
        React.createElement("iframe", {
          title: t("nearby.mapTitle"),
          srcDoc: html,
          style: { height: "100%", width: "100%", border: 0 },
          sandbox: "allow-scripts allow-popups allow-popups-to-escape-sandbox",
        })
      ) : (
        <WebView
          originWhitelist={["*"]}
          source={{ html }}
          onMessage={(event) => {
            const place = items.find((p) => p.id === event.nativeEvent.data);
            if (place) onDirections(place);
          }}
          style={{ flex: 1 }}
        />
      )}
    </View>
  );
}
