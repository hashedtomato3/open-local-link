// Copyright (C) 2020 hashedtomato3@gmail.com
// License: MIT 

// app name
const appName = "com.node.open_local"

//import JSZip from 'jszip';

{
  // set title
  document.getElementById("extName").innerHTML = chrome.runtime.getManifest().name;
  
  // set manifest data
  const manifest = {
    "name": "com.node.open_local",
    "description": "Open local link by clicking it",
    "path": "host.bat",
    "type": "stdio",
    "allowed_origins": [
      `chrome-extension://${chrome.runtime.id}/`,
    ]
  };
  const manifestJson = JSON.stringify(manifest, null, '\t');

  // set host.zip link
  const resp = await fetch("/host.zip"); 
  const host_blob = await resp.blob(); 
  const zip = new JSZip(); 
  const top_zip = await zip.loadAsync(host_blob); 
  const host_zip = await top_zip.folder("host"); 
  host_zip.file("manifest.json", manifestJson); 
  const blob2 = await top_zip.generateAsync({type:"blob"});   
  const hostZipLink = document.getElementById('host_zip_link');
  hostZipLink.href = URL.createObjectURL(blob2);

  // on click of check instalation button
  document.getElementById("check").addEventListener("click", function(e){
    chrome.runtime.sendNativeMessage(appName, {cmd:"get-options"}, response => {
      console.info("response:");
      console.info(response);
      if (typeof response === "undefined") { // error occur in connecting to host
        alert("<< NOT INSTALLED >>\n\n"+chrome.runtime.lastError.message);
      } else if( "error" in response ) { // error in native host
        alert("<< ERROR in Native Client >>\n\n"+JSON.stringify(response, ["error","message"], 4));
      } else {
        alert(`<< INSTALLATION OK >>\n\nNative client is installed in ${response.cwd}.`)
      }
    });
  });

  // set links
  document.getElementById("options_page").href = chrome.runtime.getURL("install.html");
  document.getElementById("store_page").href= "https://chrome.google.com/webstore/detail/"+chrome.runtime.id;
}
