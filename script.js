
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

    lista.style.display = "flex";
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
        <div id="menu-pedido-container" style="background-color:${dominantColor};">
            <article>
                <img src="${img.src}" alt="imagem-produto">
            </article>
            <article id="menu-pedido">
                <h3>${name}</h3>
                <form action="" method="get">
                    <select name="tamanho" id="tamanho">
                        <option value="Mini">Trufa Mini</option>
                        <option value="Trufa">Trufa</option>
                    </select>
                    <select name="casca" id="casca">
                        <option value="Chocolate Meio Amargo">Chocolate Meio Amargo</option>
                        <option value="Chocolate Branco">Chocolate Branco</option>
                        <option value="Chocolate ao Leite">Chocolate ao Leite</option>
                        <option value="Chocolate Misto">Chocolate Misto ( Ao Leite + Meio Amargo )</option>
                    </select>
                    <button type="submit">Colocar no Carrinho</button>
                </form>
            </article>
        </div>`;

             menu = document.getElementById('menu-pedido-container');       
             menu.addEventListener('click', function(){
                 closeOpenPedido()
             });


        });


    });
});


function closeOpenPedido() {
    document.getElementById('menu-pedido-container').remove();
}

//Retira os Acentos da str passada
function removerAcentos(str) {
    //Gerado com IA
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
