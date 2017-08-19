var tbody, trBase, quantidadeExercicios;

var urlBase = "https://github.com/paulosalvatore/exercicios_python/";
var urlBaseRaw = "https://raw.githubusercontent.com/paulosalvatore/exercicios_python/";

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

		var urlResposta = urlBase + "respostas/resposta" + i + ".py";
		var urlRespostaRaw = urlBaseRaw + "respostas/resposta" + i + ".py";

		td.eq(2).find("a").eq(0).attr("href", urlResposta);
		td.eq(2).find("a").eq(1).attr("href", urlRespostaRaw);
	}
}

$(function(){
	tbody = $("#exercicios").find("table").find("tbody");
	trBase = tbody.find("tr");
	trBase.remove();

	$.getJSON("https://api.github.com/repos/paulosalvatore/mindrace/contents/Arduino", function(data){
		quantidadeExercicios = data.length;

		atualizarListaExercicios();
	});
});