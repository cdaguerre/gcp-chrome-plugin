const loopSpeed = 100;

function loop(){
  const rows = document.querySelectorAll('[pan-data-name="container"]')

  rows.forEach((row) => {    
    if (row.children.length > 5) {
      return;
    }
    const headerRow = row.closest('table').querySelector('thead tr')
    
    if (headerRow.children.length == 5) {
      const headerCell = document.createElement('th')
      headerCell.innerText = 'Exec'
      headerRow.appendChild(headerCell)
    }
    
    const container = row.querySelector('td a').innerText.trim()    
    const cell = document.createElement('td')
    const a = document.createElement('a')
    const label = document.createElement('span')
    label.innerText = "Copy exec command"
    
    a.addEventListener("click", function() {
      const url = new URL(window.location.href)
      const components = url.pathname.split('/')
      
      const project = url.searchParams.get('project')
      const region = components[3]
      const cluster = components[4]
      const namespace = components[5]
      const pod = components[6]
      
      const command = `gcloud container clusters get-credentials ${cluster} --region ${region} --project ${project} && kubectl exec ${pod} --namespace ${namespace} -c ${container} -ti sh`;
      
      navigator.permissions.query({name: 'clipboard-write'}).then(result => { 
        if (result.state == 'granted' || result.state == 'prompt') {
          navigator.clipboard.writeText(command);
        }
      });
    }, false);
    
    a.appendChild(label)
    cell.appendChild(a)
    row.appendChild(cell)
  });
};

setInterval(loop, loopSpeed);