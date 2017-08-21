var linguagem = "Python";

var nomeProjeto = "Exercicios" + linguagem;
var projetoWebsite = "exercicios_" + linguagem.toLowerCase();

var url = "https://github.com/paulosalvatore/";

var urlAPI = "https://api.github.com/repos/paulosalvatore/" + nomeProjeto + "/contents/resolucoes";
var urlBase = url + nomeProjeto + "/";
var urlWebsiteBase = url + projetoWebsite + "/";
var urlBaseDiretorios = urlBase + "/tree/master/";

var dificuldades = {
	"Principiante": 1,
	"Intermediário": 2,
	"Avançado": 3
};

// Atualização de Lista de Exercícios
function atualizarListaExercicios(arquivos)
{
	var tbodyExercicios = $("#exercicios").find("table").find("tbody");
	var trBaseLinks = tbodyExercicios.find("tr");
	trBaseLinks.remove();

	$.each(arquivos, function(chave, arquivo) {
		chave++;

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

			var objetivo = linhas[3].split("Objetivo: ").join("");
			var dificuldade = linhas[4].split("Dificuldade: ").join("");
			var dificuldadeId = dificuldades[dificuldade];

			var trClone = trBaseLinks.clone();

			var td = trClone.find("td");

			td.eq(0).text(chave);

			td.eq(1).find("a").eq(0).attr("href", linkExercicio(htmlURL));
			td.eq(1)
				.find("a").eq(1)
				.attr("download", "exercicio" + chave + ".py")
				.attr("href", "data:application/python;charset=utf-8;base64," + btoa(conteudoExercicio));

			td.eq(2).find("a").eq(0).attr("href", htmlURL);
			td.eq(2)
				.find("a").eq(1)
				.attr("download", "exercicio" + chave + "_resolvido.py")
				.attr("href", "data:application/python;charset=utf-8;base64," + btoa(conteudo));

			td.eq(3).attr("data-order", dificuldadeId);
			td.eq(3).find(".dificuldade").text(dificuldade);
			td.eq(3).find(".objetivo").attr("title", objetivo);

			tbodyExercicios.append(trClone);

			if (chave === arquivos.length)
				definirEventos();
		});
	});
}

// Transformar link de arquivo de exercício para link de arquivo de resolução
function linkExercicio(url)
{
	return url
		.split("/resolucoes/")
		.join("/exercicios/")
		.split("_resolvido")
		.join("");
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

// Eventos da Página
function definirEventos()
{
	setTimeout(function(){
		$("[data-toggle='tooltip']").tooltip();

		definirDataTable();
	}, 50);
}

// Atualizar Tabela de Links
function atualizarLinks()
{
	var tbodyLinks = $("#links").find("table").find("tbody");
	var trBaseLinks = tbodyLinks.find("tr");
	trBaseLinks.remove();

	$.each(links, function(chave, link){
		chave++;

		var trClone = trBaseLinks.clone();

		var td = trClone.find("td");

		td.eq(0).text(chave);

		td.eq(1).find("a").attr("href", link.link).text(link.titulo);

		td.eq(2).text(link.descricao);

		tbodyLinks.append(trClone);
	});
}

$(function(){
	$("a[data-type='github']").attr("href", urlBase);
	$("a[data-type='website_files']").attr("href", urlWebsiteBase);
	$("a[data-type='exercicios']").attr("href", urlBaseDiretorios + "exercicios/");
	$("a[data-type='resolucoes']").attr("href", urlBaseDiretorios + "resolucoes/");

	atualizarLinks();

	$.getJSON(urlAPI, function(arquivos){
		atualizarListaExercicios(arquivos);
	});
});
