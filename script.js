const csv = "taxas.csv";

fetch(csv)
    .then(response => response.text())
    .then(data => {
        const rows = data.trim().split("\n").slice(1);
        const cursos = rows.map(row => {
            const [nome, qtMat, percFem, percMasc] = row.split(",");
            return { nome, qtMat: +qtMat, percFem: +percFem, percMasc: +percMasc };
        });

        const svg = document.getElementById("chart");
        const tooltip = document.getElementById("tooltip");
        const width = svg.getAttribute("width");
        const height = svg.getAttribute("height");
        const barWidth = width / cursos.length / 2;
        const maxHeight = height - 40;

        cursos.forEach((curso, i) => {
            const x = i * barWidth * 2 + barWidth / 2;

            // Barra feminina
            const femHeight = (curso.percFem / 100) * maxHeight;
            const femBar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            femBar.setAttribute("x", x);
            femBar.setAttribute("y", height - femHeight);
            femBar.setAttribute("width", barWidth / 2);
            femBar.setAttribute("height", femHeight);
            femBar.setAttribute("fill", "#362FD9");
            femBar.classList.add("bar");
            femBar.addEventListener("mouseover", () => {
                tooltip.style.display = "block";
                tooltip.textContent = `${curso.percFem.toFixed(2)}% mulheres`;
            });
            femBar.addEventListener("mousemove", (event) => {
                tooltip.style.left = event.pageX + 10 + "px";
                tooltip.style.top = event.pageY + 10 + "px";
            });
            femBar.addEventListener("mouseout", () => {
                tooltip.style.display = "none";
            });
            svg.appendChild(femBar);

            // Barra masculina
            const mascHeight = (curso.percMasc / 100) * maxHeight;
            const mascBar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            mascBar.setAttribute("x", x + barWidth / 2);
            mascBar.setAttribute("y", height - mascHeight);
            mascBar.setAttribute("width", barWidth / 2);
            mascBar.setAttribute("height", mascHeight);
            mascBar.setAttribute("fill", "#1AACAC");
            mascBar.classList.add("bar");
            mascBar.addEventListener("mouseover", () => {
                tooltip.style.display = "block";
                tooltip.textContent = `${curso.percMasc.toFixed(2)}% homens`;
            });
            mascBar.addEventListener("mousemove", (event) => {
                tooltip.style.left = event.pageX + 10 + "px";
                tooltip.style.top = event.pageY + 10 + "px";
            });
            mascBar.addEventListener("mouseout", () => {
                tooltip.style.display = "none";
            });
            svg.appendChild(mascBar);

            // Nome do curso
            const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
            label.setAttribute("x", x + barWidth / 2);
            label.setAttribute("y", height - 5);
            label.classList.add("label");
            label.textContent = curso.nome.split(" - ")[0];
            svg.appendChild(label);
        });

        // Labels dos eixos
        const femLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        femLabel.setAttribute("x", width / 4);
        femLabel.setAttribute("y", 50);
        femLabel.classList.add("axis-label");
        femLabel.textContent = "MULHERES (%)";
        svg.appendChild(femLabel);

        const mascLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        mascLabel.setAttribute("x", (3 * width) / 4);
        mascLabel.setAttribute("y", 50);
        mascLabel.classList.add("axis-label");
        mascLabel.textContent = "HOMENS (%)";
        svg.appendChild(mascLabel);
    });
