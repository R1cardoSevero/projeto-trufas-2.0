
function showHide(lista, optionClicked) {
    //Pegando todos os elementos com essa classe "lista-produtos"
    var listas = document.querySelectorAll(".lista-produtos");
    var options = document.querySelectorAll("#options h3")

    //Retirando a class de todas options
    options.forEach(function (option) {
        option.classList.remove("escolhido");
    })

    //Atribuindo display none ao elemento cliclado, colocando "this" na funcão, que acaba puxando o elemento em si 
    optionClicked.classList.add("escolhido");

    //Um looping que cada loop ele usa um dos elementos da lista
    listas.forEach(function (lista) {
        lista.style.display = "none";
    });

    lista.style.display = "grid";
}

document.addEventListener('DOMContentLoaded', function () {
    const carrinho = document.getElementById('carrinho');
    var lista = carrinho.querySelector('ul');
    const conteudoSalvo = localStorage.getItem('carrinhoConteudo');
    if (conteudoSalvo) {
        lista.innerHTML = conteudoSalvo; // Restaura o conteúdo salvo
    }

});

function pegarPedido(botao) {
    const menu = botao.closest('#menu-pedido-container');
    const img = menu.querySelector('img').src;
    const sabor = menu.querySelector('h3').textContent;
    const tamanhoSelected = menu.querySelector('#tamanho');   
    const tamanho = menu.querySelector('#tamanho').value;  
    const peso = tamanhoSelected.selectedOptions[0].dataset.peso;
    const casca = menu.querySelector('#casca').value;
    const quantidade = menu.querySelector('#quantidade').value; 
    adicionarAoCarrinho(sabor, tamanho, casca, quantidade, peso, img);
    closePedido();
}

function adicionarAoCarrinho(sabor, tamanho, casca, quantidade, peso, img) {
    const PRECO = 4.00;
    const carrinho = document.getElementById('carrinho')
    var lista = carrinho.querySelector('ul');
    lista.innerHTML += `
            <li class="itemCarrinho">
                <article>
                    <img src="${img}" style="height:90px;" alt="imagem-produto">
                    <div>   
                        <h2>Trufa de ${sabor}</h2>
                        <h3>${tamanho} - ${peso}g</h3>
                    </div>
                </article>
                <article>
                    <div>
                        <h2>Unidade</h2>
                        <h3>R$ 4.00</h3>
                    </div>
                    <div>
                        <h2>Quantidade</h2>
                        <h3>${quantidade}</h3>
                    </div>
                    <div>
                        <h2>Total</h2>
                        <h3>R$ ${quantidade * PRECO}</h3>
                    </div>
                </article>
                <i class="fa-solid fa-xmark" onclick="removeItem(this)"></i>
            </li>
    `;
    //Salvando o conteudo do carrinho no localStorage
    localStorage.setItem('carrinhoConteudo', lista.innerHTML);
}

//localStorage.removeItem('carrinhoConteudo');

function closePedido() {
    document.getElementById('menu-pedido-container').remove();
}

//Retira os Acentos da str passada
function removerAcentos(str) {
    //Gerado com IA
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function closeOpenCarrinho(){
    var carrinho = document.getElementById('carrinho');
    carrinho.classList.toggle('carrinhoOpen');
}

function uncheckBox(){
    document.getElementById('checkBox').checked = false;
}

function removeItem(itemClicked){
    itemClicked.closest('li').remove();
    var carrinho = document.getElementById('carrinho');
    var lista = carrinho.querySelector('ul');
    localStorage.setItem('carrinhoConteudo', lista.innerHTML);
}

// 1. Conexão com o Supabase
const supabaseUrl = 'https://garblafvvlfvjqsuezpo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhcmJsYWZ2dmxmdmpxc3VlenBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5Mzg4MjQsImV4cCI6MjA2NTUxNDgyNH0.9nxpocghJx1g3vtaSO7oiy4cMJ7zdA_psrFrjG_bkVM';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// 2. Função para carregar as trufas da tabela
async function carregarTrufas() {
  // Busca todas as trufas da tabela 'trufas'
  const { data, error } = await supabaseClient.from('trufas').select('*') // Exibe todas trufas desativadas/ativadas
  console.log(data)
  if (error) {
    console.error('Erro ao buscar trufas:', error);
    return;
  }

  const container = document.querySelector('.catalogo');
  container.innerHTML = ''; // limpa conteúdo anterior

  // 3. Para cada trufa recebida do banco...
  for (const trufa of data) {

    // Busca a URL pública da imagem no bucket

    const principalPath = `${trufa.id}/principal.png`;
    const backgroundPath = `${trufa.id}/background.png`;

    const { data: principalData } = supabaseClient.storage.from('imagenstrufas').getPublicUrl(principalPath);
    const { data: backgroundData } = supabaseClient.storage.from('imagenstrufas').getPublicUrl(backgroundPath);

    const principal = principalData?.publicUrl;
    const background = backgroundData?.publicUrl;

    const alcoolica = trufa.alcoolico ? 'block' : 'none';
    const vegana = trufa.vegana ? 'block' : 'none';
    const sabor = trufa.sabor;
    const ativada = trufa.ativo ? 'block' : 'none';

    const article = document.createElement('article');
    article.className = 'product';
    article.style.backgroundImage = `url('${background}')`;
    article.style.backgroundSize = 'cover';
    article.style.backgroundPosition = 'center';
    article.style.display = ativada;

    // Adiciona o conteúdo interno do article
    article.innerHTML = `
    <div id="alertas">
        <div class="alcoolico-ativado" style="display: ${alcoolica};">
            <img src="icons/bebida-vetor.svg" alt="Trufa Alcoolica">
        </div>
        <div class="vegana-ativado" style="display: ${vegana};">
            <img src="icons/vegana-icon.png" alt="Trufa Vegana">
        </div>
    </div>
    <h3>${sabor}</h3>
    <img class="foto-trufa" src="${principal}" alt="">
    <button class="botao-pedir" data-id="${trufa.id}" type="submit">Adicionar ao Carrinho</button>
    `;
    article.querySelector('.botao-pedir').addEventListener('click', function () {
        fazendoPedido(this);
    });

    // Adiciona ao container
    container.appendChild(article);
  };
};
// 4. Carrega as trufas ao carregar a página
carregarTrufas();

function fazendoPedido(botao){
    const main = document.getElementById('innerHTML-location');
    const card = botao.closest('article');
    const name = removerAcentos(card.querySelector('h3').textContent);
    var img = card.querySelector('img.foto-trufa'); // Seleciona a imagem da trufa
       
    
    main.innerHTML = `
        <div id="menu-pedido-container">
            <article >
                <img src="${img.src}" alt="imagem-produto" ">
            </article>
            <article id="menu-pedido">
                <h3>${name}</h3>
                <div>
                    <h4>Escolha o tamanho</h4>
                    <select name="tamanho" id="tamanho">
                        <option value="Trufa" data-peso="70">Trufa</option>
                        <option value="Trufa Mini" data-peso="45">Mini Trufa</option>
                    </select>
                    <h4>Sabor da casca</h4>
                    <select name="casca" id="casca">
                        <option value="Chocolate Meio Amargo">Chocolate Meio Amargo</option>
                        <option value="Chocolate Branco">Chocolate Branco</option>
                        <option value="Chocolate ao Leite">Chocolate ao Leite</option>
                        <option value="Chocolate Misto">Chocolate Misto ( Ao Leite + Meio Amargo )</option>
                    </select>
                    <h4>Quantidade</h4>
                    <input type="number" name="quantidade" id="quantidade" min="1" step="1" value="1">
                    <button onClick="pegarPedido(this)">Colocar no Carrinho</button>
                </div>
            </article>
        </div>`;
}