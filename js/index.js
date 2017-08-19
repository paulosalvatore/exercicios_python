var tbody, trBase, quantidadeExercicios;

var nomeProjeto = "ExerciciosPython";
var projetoWebsite = "exercicios_python";

var url = "https://github.com/paulosalvatore/";
var urlBase = url + nomeProjeto + "/";
var urlWebsiteBase = url + projetoWebsite + "/";
var urlBaseDiretorios = urlBase + "/tree/master/";
var urlBaseArquivos = urlBase + "/blob/master/";
var urlBaseRaw = "https://raw.githubusercontent.com/paulosalvatore/" + nomeProjeto + "/master/";

function atualizarListaExercicios()
{
	for (var i = 1; i <= quantidadeExercicios; i++)
	{
		var trClone = trBase.clone();

		tbody.append(trClone);

		var td = trClone.find("td");

		td.eq(0).text(i);

		var urlEnunciado = urlBaseArquivos + "exercicios/exercicio" + i + ".py";
		var urlEnunciadoRaw = urlBaseRaw + "exercicios/exercicio" + i + ".py";

		td.eq(1).find("a").eq(0).attr("href", urlEnunciado);
		td.eq(1).find("a").eq(1).attr("href", urlEnunciadoRaw);

		var urlResolucao = urlBaseArquivos + "resolucoes/exercicio" + i + ".py";
		var urlResolucaoRaw = urlBaseRaw + "resolucoes/exercicio" + i + ".py";

		td.eq(2).find("a").eq(0).attr("href", urlResolucao);
		td.eq(2).find("a").eq(1).attr("href", urlResolucaoRaw);
	}
}

$(function(){
	$("a[data-type='github']").attr("href", urlBase);
	$("a[data-type='website_files']").attr("href", urlWebsiteBase);
	$("a[data-type='exercicios']").attr("href", urlBaseDiretorios + "exercicios/");
	$("a[data-type='resolucoes']").attr("href", urlBaseDiretorios + "resolucoes/");

	tbody = $("#exercicios").find("table").find("tbody");
	trBase = tbody.find("tr");
	trBase.remove();

	$.getJSON("https://api.github.com/repos/paulosalvatore/" + nomeProjeto + "/contents/exercicios", function(data){
		quantidadeExercicios = data.length;

		atualizarListaExercicios();
	});
});
