var entrada = "";
var entradaB;
var actualAction = "";
var actualToken = "";
var state = 0;
var pilhaP = [];
var entradaP = [];
var backStack;
var pastRead = false;
var newStack2 = "";
var parsingTable = {
  S: {
    a: "aBc",
    b: "",
    c: "cCb",
    $: "",
  },
  A: {
    a: "",
    b: "bb",
    c: "c",
    $: "",
  },
  B: {
    a: "",
    b: "bAa",
    c: "ε",
    $: "erro",
  },
  C: {
    a: "aSb",
    b: "",
    c: "",
    $: "",
  },
};
// Botões
let stepBtn = document.querySelector(".btnSTS");
let newStepBtn = document.querySelector(".btnSTS2");
newStepBtn.style.display = "none";
let fastExecBtn = document.querySelector(".fastExecBtn");
let resetBtn = document.querySelector(".resetBtn");

// Divs das pilhas
let pilhaE = document.querySelector(".Pilha");
let entradaE = document.querySelector(".Entrada");
let acaoE = document.querySelector(".Acao");

document.addEventListener("DOMContentLoaded", function () {
  stepBtn.style.display = "none";
  fastExecBtn.style.display = "none";
});

// Função para salvar a entrada
function submit() {
  stepBtn.style.display = "block";
  entrada = document.getElementById("entrada-inp");
  entrada = entrada.value;

  entradaB = false;
  if (!isLowerCase(entrada)) {
    window.alert("Por favor digite somentre letras minúsculas entre 'a' e 'c'");
    entrada = "";
    let reset = document.getElementById("entrada-inp");
    reset.value = "";
  } else {
    entradaB = true;
  }
}

// Função para checar se a entrada não contém caracteres inválidos
function isLowerCase(str) {
  let regex = /^[a-c]+$/;
  return regex.test(str);
}

// Função para gerar uma entrada aleatória
function gerarStringAleatoria() {
  const tamanhoMaximo = 10;
  const caracteres = "abc";
  let resultado = "";
  const tamanho = Math.floor(Math.random() * tamanhoMaximo) + 1;

  for (let i = 0; i < tamanho; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
    resultado += caracteres[indiceAleatorio];
  }
  entrada = document.getElementById("entrada-inp");
  entrada.value = resultado
}

// Função para realizar o primeiro passo do Step to Step
function STS() {
  if (state === 0) {
    stepBtn.style.display = "none";
    newStepBtn.style.display = "block";
  }

  for (let i = 0; i < entrada.length; i++) {
    entradaP[i] = entrada[i];
  }
  console.log(entradaP);

  // Monta a Pilha
  let newP = document.createElement("p");
  newP.textContent = "$S";
  pilhaE.appendChild(newP);
  pilhaP.push("$");
  pilhaP.push("S");

  entradaP.push("$");

  // Monta a Entrada
  let newPContent = document.createElement("p");
  newPContent.textContent = "";
  for (let i = 0; i < entradaP.length; i++) {
    newPContent.textContent += entradaP[i];
  }
  entradaE.appendChild(newPContent);

  // A partir desta parte do código para baixo começam a ser tratadas as ações da tabela de parsing
  let tokenE = entradaP[0];

  let lastToken = pilhaP[pilhaP.length - 1];
  let tokenP = lastToken;

  // A função getAction() pega a proxima ação da tabela através do simbolo no topo das pilhas
  let nextAction = getAction(tokenE, tokenP);
  
  console.log(nextAction);
  let reversedAction = nextAction.split("").reverse().join("");
  pilhaP.pop();
  for (let i = 0; i < reversedAction.length; i++) {
    pilhaP.push(reversedAction[i]);
  }
  console.log(pilhaP);

  let newPAction = document.createElement("p");
  if(nextAction == "recusou"){
    let paragrafos = pilhaE.querySelectorAll("p");
      let numPara = paragrafos.length;
    newPAction.textContent = `Erro em${numPara} iterações`;
    actualToken = lastToken;
    actualAction = nextAction;
    acaoE.appendChild(newPAction);
    newStepBtn.style.display = "none";
      fastExecBtn.style.display = "none";
  }
  else{
  newPAction.textContent = `${lastToken} > ${nextAction}`;
  actualToken = lastToken;
  actualAction = nextAction;
  acaoE.appendChild(newPAction);
  }
}

function newStep() {
  console.log(pilhaP, entradaP);
  console.log(pilhaP.length);
  actualToken = pilhaP[pilhaP.length - 1];
  // Caso o Token da Pilha seja um não terminal e diferente do final de pilha
  if (actualToken === actualToken.toUpperCase() && actualToken !== "$") {
    console.log(actualToken, actualAction, "para");
    let resultado = stepStack();
    // Caso recuse a sentença ou a pilha chegue ao final($) mas a entrada não
    if (
      resultado[0] == "recusou" ||
      (pilhaP.length <= 1 && entradaP[0] !== "$")
    ) {
      let newStack = "";
      for (let i = 0; i < pilhaP.length; i++) {
        newStack += pilhaP[i];
      }
      let newP = document.createElement("p");
      newP.textContent += `${newStack}`;
      pilhaE.appendChild(newP);

      let newPContent = document.createElement("p");
      newPContent.textContent = "";
      for (let i = 0; i < entradaP.length; i++) {
        newPContent.textContent += entradaP[i];
      }
      entradaE.appendChild(newPContent);

      let paragrafos = pilhaE.querySelectorAll("p");
      let numPara = paragrafos.length;
      let newPAction = document.createElement("p");
      newPAction.textContent = `Erro em ${numPara} iterações`;
      acaoE.appendChild(newPAction);

      newStepBtn.style.display = "none";
      fastExecBtn.style.display = "none";
    }
    // Caso retorne um erro na tabela de parsing
     else if (resultado == "erro") {
      let newStack = "";
      for (let i = 0; i < pilhaP.length; i++) {
        newStack += pilhaP[i];
      }
      let newP = document.createElement("p");
      newP.textContent += `${newStack}`;
      pilhaE.appendChild(newP);

      let newPContent = document.createElement("p");
      newPContent.textContent = "";
      for (let i = 0; i < entradaP.length; i++) {
        newPContent.textContent += entradaP[i];
      }
      entradaE.appendChild(newPContent);

      let paragrafos = pilhaE.querySelectorAll("p");
      let numPara = paragrafos.length;
      let newPAction = document.createElement("p");
      newPAction.textContent = `Erro em ${numPara} iterações`;
      acaoE.appendChild(newPAction);

      newStepBtn.style.display = "none";
      fastExecBtn.style.display = "none";
    }
    // Quando o epsilon aparece na ação
    else if (resultado == "epsilon") {
      console.log("eps");

      let newStack = "";
      for (let i = 0; i < pilhaP.length; i++) {
        newStack += pilhaP[i];
      }
      let newP = document.createElement("p");
      newP.textContent += `${newStack}`;
      pilhaE.appendChild(newP);

      let newPContent = document.createElement("p");
      newPContent.textContent = "";
      for (let i = 0; i < entradaP.length; i++) {
        newPContent.textContent += entradaP[i];
      }
      entradaE.appendChild(newPContent);

      let newPAction = document.createElement("p");
      newPAction.textContent = `${actualToken} > ε`;
      acaoE.appendChild(newPAction);
      pilhaP.pop();
    } 
    // Caso não haja erro, a execução normal é feita, seguindo a tabela de parsing
    else {
      console.log(resultado[0], "res 0");
      console.log(resultado[1], "res 1");
      let novaPilha = resultado[0];
      let nextAction = resultado[1];
      console.log(pastRead);
      let newStack = "";
      for (let i = 0; i < pilhaP.length; i++) {
        newStack += pilhaP[i];
      }
      console.log(actualToken, novaPilha, nextAction, "apos step");

      let newP = document.createElement("p");
      if (pastRead == true) {
        // caso de erro visual na pilha trocar para o newStack2 (pode resolver ou pode dar o erro numero 2)
        newP.textContent += `${newStack}`;
        //pastRead == false;
      } else {
        newP.textContent += `${newStack}`;
      }
      pilhaE.appendChild(newP);

      let newPContent = document.createElement("p");
      newPContent.textContent = "";
      for (let i = 0; i < entradaP.length; i++) {
        newPContent.textContent += entradaP[i];
      }
      entradaE.appendChild(newPContent);

      let newPAction = document.createElement("p");
      newPAction.textContent = `${actualToken} > ${nextAction}`;
      acaoE.appendChild(newPAction);
      actualAction = nextAction;
    }
  }
  // Caso os simbolos sejam iguais mas a pilha tem tamanho maior do que 1
   else if (pilhaP[0] == entradaP[0] && pilhaP.length > 1) {
    let newStack = "";
    for (let i = 0; i < pilhaP.length; i++) {
      newStack += pilhaP[i];
    }
    let newP = document.createElement("p");
    newP.textContent += `${newStack}`;
    pilhaE.appendChild(newP);

    let newPContent = document.createElement("p");
    newPContent.textContent = "";
    for (let i = 0; i < entradaP.length; i++) {
      newPContent.textContent += entradaP[i];
    }
    entradaE.appendChild(newPContent);

    let paragrafos = pilhaE.querySelectorAll("p");
    let numPara = paragrafos.length;
    let newPAction = document.createElement("p");
    newPAction.textContent = `Erro em ${numPara} iterações`;
    acaoE.appendChild(newPAction);

    newStepBtn.style.display = "none";
    fastExecBtn.style.display = "none";
  } 
  // Caso a pilha termine mas a entrada não
  else if (pilhaP.length <= 1 && entradaP.length > 1) {
    let newStack = "";
    for (let i = 0; i < pilhaP.length; i++) {
      newStack += pilhaP[i];
    }
    let newP = document.createElement("p");
    newP.textContent += `${newStack}`;
    pilhaE.appendChild(newP);

    let newPContent = document.createElement("p");
    newPContent.textContent = "";
    for (let i = 0; i < entradaP.length; i++) {
      newPContent.textContent += entradaP[i];
    }
    entradaE.appendChild(newPContent);

    let paragrafos = pilhaE.querySelectorAll("p");
    let numPara = paragrafos.length;
    let newPAction = document.createElement("p");
    newPAction.textContent = `Erro em ${numPara} iterações`;
    acaoE.appendChild(newPAction);

    newStepBtn.style.display = "none";
    fastExecBtn.style.display = "none";
  }
  // Caso os não terminais sejam iguais
   else if (
    actualToken === actualToken.toLocaleLowerCase() &&
    actualToken !== "$" &&
    pilhaP[pilhaP.length - 1] == entradaP[0]
  ) {
    console.log("igual");
    let tokenLido = entradaP[0];
    let novaPilha = readStack();
    console.log(novaPilha, entradaP[0]);

    let newP = document.createElement("p");
    newP.textContent += `${novaPilha}`;
    pilhaE.appendChild(newP);

    let newPContent = document.createElement("p");
    newPContent.textContent = "";
    for (let i = 0; i < entradaP.length; i++) {
      newPContent.textContent += entradaP[i];
    }
    entradaE.appendChild(newPContent);

    let newPAction = document.createElement("p");
    newPAction.textContent = `Ler ${tokenLido}`;
    acaoE.appendChild(newPAction);
    pilhaP.pop();
    entradaP.shift();
    /*if(!pastRead){
      pastRead
    }
    else{
      pastRead = false;
    }*/
    pastRead = true;
  } 
  // Caso a pilha e a entrada tenham o mesmo tamanho(1), e sejam iguais, a resposta é aceita
  else if (pilhaP[0] == entradaP[0] && pilhaP.length == entradaP.length) {
    let newStack = "";
    for (let i = 0; i < pilhaP.length; i++) {
      newStack += pilhaP[i];
    }
    backStack = newStack;
    let newP = document.createElement("p");
    newP.textContent += `${newStack}`;
    pilhaE.appendChild(newP);

    let newPContent = document.createElement("p");
    newPContent.textContent = "";
    for (let i = 0; i < entradaP.length; i++) {
      newPContent.textContent += entradaP[i];
    }
    entradaE.appendChild(newPContent);

    let paragrafos = pilhaE.querySelectorAll("p");
    let numPara = paragrafos.length;
    let newPAction = document.createElement("p");
    newPAction.textContent = `Aceito em ${numPara} iterações`;
    acaoE.appendChild(newPAction);

    newStepBtn.style.display = "none";
    fastExecBtn.style.display = "none";
  }
}
// Função para realizar o proximo passo na pilha
function stepStack() {
  let tokenE = entradaP[0];
  let tokenP = actualToken;
  console.log(actualToken, "atual");
  backStack = pilhaP;
  let nextAction = getAction(tokenE, tokenP);

  if (nextAction == "recusou") {
    return ["recusou", actualAction];
  }
  if (nextAction == "ε") {
    return "epsilon";
  }
  if (nextAction == "erro") {
    return "erro";
  }
  for (let i = 0; i < backStack.length; i++) {
    newStack2 += backStack[i];
  }
  console.log(nextAction);
  pilhaP.pop();

  console.log(newStack2, "ns2");
  let reversedAction = nextAction.split("").reverse().join("");
  let newStack = "";
  for (let i = 0; i < reversedAction.length; i++) {
    pilhaP.push(reversedAction[i]);
  }
  for (let i = 0; i < pilhaP.length; i++) {
    newStack += pilhaP[i];
  }
  console.log(pilhaP);
  return [newStack, nextAction];
}
// Função para a leitura de não terminais no topo da pilha
function readStack() {
  let newStack = "";
  for (let i = 0; i < pilhaP.length; i++) {
    newStack += pilhaP[i];
  }
  return newStack;
}

function sucess(tokenE, tokenP) {
  return tokenE == "$" && tokenP == "$";
}
function getAction(tokenE, tokenP) {
  if (tokenE == tokenP && !sucess(tokenE, tokenP)) {
    return "read";
  } else if (sucess()) {
    console.log("aceito");
  } else if (tokenE == "$" && tokenP !== "$") {
    return "erro";
  } else {
    let nextAction = parsingTable[tokenP][tokenE];
    if (nextAction == "") {
      return "recusou";
    } else {
      console.log("?");
      return nextAction;
    }
  }
}

function fastExec() { }

function reset() {
  entrada = "";
  entradaB;
  actualAction = "";
  actualToken = "";
  state = 0;
  pilhaP = [];
  entradaP = [];
  entrada = document.getElementById("entrada-inp");
  entrada.value = "";
  newStack2 = "";

  let paragPilha = pilhaE.getElementsByTagName("p");
  let paragPilhaArray = Array.from(paragPilha);

  paragPilhaArray.forEach((paragPilha) => {
    pilhaE.removeChild(paragPilha);
  });

  let paragEntrada = entradaE.getElementsByTagName("p");
  let paragEntradaArray = Array.from(paragEntrada);

  paragEntradaArray.forEach((paragEntrada) => {
    entradaE.removeChild(paragEntrada);
  });

  let paragAcao = acaoE.getElementsByTagName("p");
  let paragAcaoArray = Array.from(paragAcao);

  paragAcaoArray.forEach((paragAcao) => {
    acaoE.removeChild(paragAcao);
  });
}

// Erro na validação de não terminais diferentes
// E o erro visual na pilha com o comando após Ler