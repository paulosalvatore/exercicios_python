var linguagem = "Python";
var extensao = "py";

var mime = "application/python";
var downloadHabilitado = false;

var nomeProjeto = "Exercicios" + linguagem;
var projetoWebsite = "exercicios_" + linguagem.toLowerCase();

var url = "https://github.com/paulosalvatore/";

var urlAPI = "https://api.github.com/repos/paulosalvatore/" + nomeProjeto + "/contents/";
var diretorioExercicios = "exercicios";
var diretorioResolucoes = "resolucoes";
var urlBase = url + nomeProjeto + "/";
var urlWebsiteBase = url + projetoWebsite + "/";
var urlBaseDiretorios = urlBase + "/tree/master/";

var dificuldades = {
	"Principiante": 1,
	"Intermediário": 2,
	"Avançado": 3
};

var arquivosLidos = [];
var exerciciosResolucao = 0;
var exerciciosSemResolucao = 0;

var quantidadeExerciciosElemento;
var quantidadeExercicios = 0;

var tbodyExercicios, trBaseLinks;

// Pegar ID de Exercício baseado no nome
function pegarIdExercicio(nome)
{
	var nomeLimpo =
		nome
			.replace("exercicio", "")
			.replace("_resolvido." + extensao, "");

	return parseInt(nomeLimpo);
}

// Atualização de Lista de Exercícios
function atualizarListaExercicios(arquivos)
{
	exerciciosResolucao = arquivos.length;

	$.each(arquivos, function(chave, arquivo){
		carregarArquivo(arquivo);
	});
}

function carregarArquivo(arquivo, sem_resolucao)
{
	var exercicio_sem_resolucao =
		(typeof(sem_resolucao) !== "undefined" &&
		sem_resolucao);

	var id = pegarIdExercicio(arquivo.name);

	var downloadURL = arquivo.download_url;
	var htmlURL = arquivo.html_url;

	$.ajax({
		url: downloadURL
	}).done(function(conteudo){
		var linhas = conteudo.split("\n");

		var linhaEncontrada = 0;

		var conteudoExercicio = linhas.slice();

		$.each(linhas, function(index, value){
			if (value === '"""')
				linhaEncontrada++;

			if (linhaEncontrada === 2)
			{
				conteudoExercicio =
					linhas
						.slice(0, index + 2)
						.join("\n");

				return false;
			}
		});

		var nome = linhas[3].replace("Nome: ", "");
		var objetivo = linhas[4].replace("Objetivo: ", "");
		var dificuldade = linhas[5].replace("Dificuldade: ", "");
		var dificuldadeId = dificuldades[dificuldade];

		var trClone = trBaseLinks.clone();

		var td = trClone.find("td");

		td.eq(0)
			.text(id);

		td.eq(1)
			.find("a").eq(0)
			.text(nome)
			.attr("href", linkExercicio(htmlURL));

		if (downloadHabilitado)
		{
			td.eq(1)
				.find("a").eq(1)
				.attr("download", "exercicio" + id + "." + extensao)
				.attr("href", "data:" + mime + ";charset=utf-8;base64," + btoa(unescape(encodeURIComponent(conteudoExercicio))));
		}
		else
		{
			td.eq(1)
				.find("a").eq(1)
				.remove();
		}

		if (!exercicio_sem_resolucao)
		{
			td.eq(2)
				.find("a")
				.eq(0)
				.attr("href", htmlURL);

			if (downloadHabilitado)
			{
				td.eq(2)
					.find("a").eq(1)
					.attr("download", "exercicio" + id + "_resolvido." + extensao)
					.attr("href", "data:" + mime + ";charset=utf-8;base64," + btoa(unescape(encodeURIComponent(conteudo))));
			}
			else
			{
				td.eq(2)
					.find("a").eq(1)
					.remove();
			}
		}
		else
		{
			td.eq(2)
				.text("Resolução não adicionada")
		}

		td.eq(3)
			.attr("data-order", dificuldadeId);
		td.eq(3)
			.find(".dificuldade")
			.text(dificuldade);
		td.eq(3)
			.find(".objetivo")
			.attr("title", objetivo);

		tbodyExercicios.append(trClone);

		arquivosLidos.push(id);

		if (!exercicio_sem_resolucao)
			checarListaExerciciosCarregada();
		else
			checarListaExerciciosSemResolucaoCarregada();

		if (id > quantidadeExercicios)
		{
			quantidadeExercicios = id;

			quantidadeExerciciosElemento.text(quantidadeExercicios);
		}
	})
	.fail(function(){
		arquivosLidos.push(id);

		if (!exercicio_sem_resolucao)
			checarListaExerciciosCarregada();
		else
			checarListaExerciciosSemResolucaoCarregada();
	});
}

function atualizarListaExerciciosSemResolucao(arquivos)
{
	$.each(arquivos, function(chave, arquivo){
		var id = pegarIdExercicio(arquivo.name);

		if (arquivosLidos.indexOf(id) === -1)
		{
			exerciciosSemResolucao++;

			carregarArquivo(arquivo, true);
		}
	});

	if (exerciciosSemResolucao === 0)
		checarListaExerciciosSemResolucaoCarregada();
}

// Transformar link de arquivo de exercício para link de arquivo de resolução
function linkExercicio(url)
{
	return url
		.replace("/resolucoes/", "/exercicios/")
		.replace("/_resolvido/", "");
}

// DataTable
function definirDataTable()
{
	var dataTable = $(".datatable");
	var dataTableOrder = [];

	dataTable
		.find("thead")
		.find("tr")
		.find("th")
		.each(function(){
			var defaultSort = $(this).hasClass("default_sort");

			if (defaultSort)
			{
				var index = $(this).index();

				var defaultSortType = $(this).hasClass("desc") ? "desc" : "asc";

				dataTableOrder.push([index, defaultSortType]);
			}
		});

	if (dataTableOrder.length === 0)
		dataTableOrder.push([0, "asc"]);

	dataTable.dataTable({
		"language": {
			"url": "//cdn.datatables.net/plug-ins/1.10.13/i18n/Portuguese-Brasil.json"
		},
		"responsive": true,
		"columnDefs": [
			{
				targets: "no-sort",
				orderable: false
			}
		],
		"order": dataTableOrder
	});
}

function checarListaExerciciosCarregada()
{
	if (arquivosLidos.length === exerciciosResolucao)
	{
		$.getJSON(urlAPI + diretorioExercicios, function(arquivos){
			atualizarListaExerciciosSemResolucao(arquivos);
		});
	}
}

function checarListaExerciciosSemResolucaoCarregada()
{
	if (arquivosLidos.length === exerciciosResolucao + exerciciosSemResolucao)
		definirEventos();
}

// Eventos da Página
function definirEventos()
{
	$("[data-toggle='tooltip']").tooltip();

	definirDataTable();
}

// Atualizar Tabela de Links
function atualizarLinks()
{
	var tbodyLinks = $("#links").find("table").find("tbody");
	var trBaseLinks = tbodyLinks.find("tr");
	trBaseLinks.remove();

	$.each(links, function(chave, link){
		var trClone = trBaseLinks.clone();

		var td = trClone.find("td");

		td.eq(0).text(chave + 1);

		td.eq(1).find("a").attr("href", link.link).text(link.titulo);

		td.eq(2).text(link.descricao);

		tbodyLinks.append(trClone);
	});
}

$(function(){
	tbodyExercicios = $("#exercicios").find("table").find("tbody");
	trBaseLinks = tbodyExercicios.find("tr");
	trBaseLinks.remove();

	quantidadeExerciciosElemento = $("#quantidadeExercicios");

	$("a[data-type='github']").attr("href", urlBase);
	$("a[data-type='website_files']").attr("href", urlWebsiteBase);
	$("a[data-type='exercicios']").attr("href", urlBaseDiretorios + "exercicios/");
	$("a[data-type='resolucoes']").attr("href", urlBaseDiretorios + "resolucoes/");

	atualizarLinks();

	$.getJSON(urlAPI + diretorioResolucoes, function(arquivos){
		atualizarListaExercicios(arquivos);
	});
});
