const csv = "taxas.csv";

fetch(csv)
    .then(response => response.text())
    .then(data => {
        const rows = data.trim().split("\n").slice(1);
        const cursos = rows.map(row => {
            const [nome, qtMat, percFem, percMasc] = row.split(",");
            return { nome, percFem: +percFem, percMasc: +percMasc };
        });

        const width = 250; // Largura de cada gráfico donut
        const height = 250; // Altura de cada gráfico donut
        const radius = Math.min(width, height) / 2;
        const colorScale = d3.scaleOrdinal(["#362FD9", "#1AACAC"]); // Cores para feminino e masculino

        const topRow = d3.select("#top-row");
        const bottomRow = d3.select("#bottom-row");

        cursos.forEach((curso, index) => {
            const svg = (index < 4 ? topRow : bottomRow).append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${width / 2}, ${height / 2})`);

            const pie = d3.pie()
                .value(d => d.value)
                .sort(null);

            const arc = d3.arc()
                .outerRadius(radius - 10)
                .innerRadius(radius - 50);

            const data = [
                { name: "Mulheres", value: curso.percFem },
                { name: "Homens", value: curso.percMasc }
            ];

            const arcs = svg.selectAll(".arc")
                .data(pie(data))
                .enter().append("g")
                .attr("class", "arc");

            arcs.append("path")
                .attr("d", arc)
                .attr("fill", d => colorScale(d.data.name));

            // Adicionar interatividade ao passar o mouse sobre as fatias
            arcs.on("mouseover", function(event, d) {
                d3.select(this).append("text")
                    .attr("class", "percentage-text")
                    .attr("transform", `translate(${arc.centroid(d)})`)
                    .attr("dy", "0.35em")
                    .style("text-anchor", "middle")
                    .style("font-size", "18px")
                    .style("fill", "black")
                    .style("font-weight", "bold")  // Deixa a fonte em negrito
                    .text(`${d.data.value.toFixed(2)}%`);
            })
            .on("mouseout", function() {
                d3.select(this).select(".percentage-text").remove();
            });

            svg.append("text")
                .attr("text-anchor", "middle")
                .attr("y", 0) // Posiciona o texto verticalmente no centro
                .attr("dy", "0.35em") // Ajusta o alinhamento vertical do texto
                .style("font-size", "18px") // Tamanho da fonte ajustado
                .style("font-weight", "bold") // Texto em negrito
                .text(curso.nome);
        });

        // Adicionar legenda
        const legendContainer = d3.select("#legend");

        const legendItems = [
            { color: "#362FD9", label: "HOMENS" },
            { color: "#1AACAC", label: "MULHERES" }
        ];

        legendItems.forEach(item => {
            const legendItem = legendContainer.append("div")
                .attr("class", "legend-item");

            legendItem.append("div")
                .attr("class", "legend-color")
                .style("background-color", item.color);

            legendItem.append("span")
                .attr("class", "legend-text")
                .text(item.label);
        });
    });






