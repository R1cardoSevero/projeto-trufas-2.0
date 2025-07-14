
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
    document.querySelectorAll('.botao-pedir').forEach(function (button) {
        button.addEventListener('click', async function () {
            var main = document.getElementById('innerHTML-location');

            //Selecionando o Pai do elemento
            var card = button.closest('article');

            //Seleciona o Sabor da Trufa pegando o conteudo do h3
            var name = removerAcentos(card.querySelector('h3').textContent);

            //Pega a Source(src) da imagem, ou seja o link dela, para usar no innerHTML
            var img = card.querySelector('img'); 
            const colorThief = new ColorThief();

            var dominantColor;
            if (img.complete) {
                dominantColor = colorThief.getColor(img);
                dominantColor = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`
            } else {
                img.addEventListener('load', () => {
                    dominantColor = colorThief.getColor(img);
                    dominantColor = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`
                });
            }
            //Adicionando o menu com estilização ja feita
            main.innerHTML = `
        <div id="menu-pedido-container">
            <article >
                <img src="${img.src}" alt="imagem-produto" style="filter: drop-shadow(-10px -10px 50px ${dominantColor} ) drop-shadow(10px 10px 150px ${dominantColor}); ">
            </article>
            <article id="menu-pedido">
                <h3>${name}</h3>
                <div>
                    <select name="tamanho" id="tamanho">
                        <option value="Trufa Mini" data-peso="45">Trufa Mini</option>
                        <option value="Trufa" data-peso="70">Trufa</option>
                    </select>
                    <select name="casca" id="casca">
                        <option value="Chocolate Meio Amargo">Chocolate Meio Amargo</option>
                        <option value="Chocolate Branco">Chocolate Branco</option>
                        <option value="Chocolate ao Leite">Chocolate ao Leite</option>
                        <option value="Chocolate Misto">Chocolate Misto ( Ao Leite + Meio Amargo )</option>
                    </select>
                    <input type="number" name="quantidade" id="quantidade" min="1" step="1" value="1">
                    <button onClick="pegarPedido(this)">Colocar no Carrinho</button>
                </div>
            </article>
        </div>`;


        var menu = document.getElementById('menu-pedido-container');       
        menu.addEventListener('click', function() {
            closePedido();
        });

        // Impede a propagação do clique no formulário
        var div = menu.querySelector('div');
        div.addEventListener('click', function(event) {
            event.stopPropagation();
        });


        });


    });
});

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