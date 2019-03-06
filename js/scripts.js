var url = 'https://en.wikipedia.org/w/api.php?action=parse&origin=*&page=Pet_door&prop=text&section=0&format=json
var wiki_request = new XMLHttpRequest();

wiki_request.onreadystatechange = ()=>{
    if (wiki_request.readyState === 4 && wiki_request.status === 200) {
        console.log(wiki_request)
    }
}

wiki_request.open('GET', url)
wiki_request.send()

