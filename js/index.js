var tbody, trBase, quantidadeExercicios;

var nomeProjeto = "ExerciciosPython";

var urlBase = "https://github.com/paulosalvatore/" + nomeProjeto + "/blob/master/";
var urlBaseRaw = "https://raw.githubusercontent.com/paulosalvatore/" + nomeProjeto + "/master/";

function atualizarListaExercicios()
{
	for (var i = 1; i <= quantidadeExercicios; i++)
	{
		var trClone = trBase.clone();

		tbody.append(trClone);

		var td = trClone.find("td");

		td.eq(0).text(i);

		var urlEnunciado = urlBase + "exercicios/exercicio" + i + ".py";
		var urlEnunciadoRaw = urlBaseRaw + "exercicios/exercicio" + i + ".py";

		td.eq(1).find("a").eq(0).attr("href", urlEnunciado);
		td.eq(1).find("a").eq(1).attr("href", urlEnunciadoRaw);

		var urlResolucao = urlBase + "resolucoes/exercicio" + i + ".py";
		var urlResolucaoRaw = urlBaseRaw + "resolucoes/exercicio" + i + ".py";

		td.eq(2).find("a").eq(0).attr("href", urlResolucao);
		td.eq(2).find("a").eq(1).attr("href", urlResolucaoRaw);
	}
}

$(function(){
	tbody = $("#exercicios").find("table").find("tbody");
	trBase = tbody.find("tr");
	trBase.remove();

	$.getJSON("https://api.github.com/repos/paulosalvatore/" + nomeProjeto + "/contents/exercicios", function(data){
		quantidadeExercicios = data.length;

		atualizarListaExercicios();
	});
});
