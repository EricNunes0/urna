import './App.scss';
import { useRef, useEffect, useState } from "react";
import candidatosJSON from "./candidatos.json";

function App() {
	const candidatos = candidatosJSON;
	const canvasRef = useRef(null);
	const [telaAtual, setTelaAtual] = useState(0);
	const [DF, setDF] = useState(null);
	const [DFValid, setDFValid] = useState(false);
	const [DE, setDE] = useState(null);
	const [DEValid, setDEValid] = useState(false);
	const [S1, setS1] = useState(null);
	const [S1Valid, setS1Valid] = useState(false);
	const [S2, setS2] = useState(null);
	const [S2Valid, setS2Valid] = useState(false);
	const [GO, setGO] = useState(null);
	const [GOValid, setGOValid] = useState(false);
	const [PR, setPR] = useState(null);
	const [PRValid, setPRValid] = useState(false);
	let candidatoTypes = ["Deputado Federal", "Deputado Estadual", "Senador - 1ª vaga", "Senador - 2ª vaga", "Governador", "Presidente"];
	let candidatoMaxDigits = [4, 5, 3, 3, 2, 2];
	let canvasBorder = 40;
    let h1 = 56;
    let h2 = 48;
    let h3 = 40;
    let h4 = 32;
	let font = `Trebuchet MS`;

	function telaBase(canvas, ctx) {
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "white";
		ctx.fillRect(canvasBorder, canvasBorder / 2, canvas.width - (canvasBorder * 2), canvas.height - (canvasBorder));
		ctx.textAlign = "center";
		ctx.font = `bold ${h4}px ${font}`;
		ctx.fillStyle = "gray";
		ctx.fillText("TREINAMENTO", canvas.width / 2, 110);
	}
	
	function telaHeader(canvas, ctx, ind) {
		function arrow(x, y, w, h, i, s, text, tx, ty) {
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x, y);
			if(i !== 0)	ctx.lineTo(x + (h / 2), y + (h / 2));
			ctx.lineTo(x, y + h);
			ctx.lineTo(x + w, y + h);
			if(i !== 1)	ctx.lineTo(x + w + (h / 2), y + (h / 2));
			ctx.lineTo(x + w, y)
			ctx.closePath();
			
			ctx.fillStyle = s === true ? "#222" : "#aaa";
			ctx.fill();
			
			ctx.fillStyle = s === true ? "#fff" : "#666";
			ctx.font = `bold 22px ${font}`;
			ctx.textAlign = "left";
			ctx.fillText(text, tx, ty);
		}
		
		let arrowsX = 50;
		let arrowsData = [
			{x: arrowsX, y: 30, w: 215, h: 40, i: 0, s: ind === 1 ? true : false, text: "Deputado Federal", tx: 60, ty: 58},
			{x: arrowsX + 220, y: 30, w: 230, h: 40, i: undefined, s: ind === 2 ? true : false, text: "Deputado Estadual", tx: 295, ty: 58},
			{x: arrowsX + 455, y: 30, w: 215, h: 40, i: undefined, s: ind === 3 ? true : false, text: "Senador - 1ª vaga", tx: 530, ty: 58},
			{x: arrowsX + 675, y: 30, w: 205, h: 40, i: undefined, s: ind === 4 ? true : false, text: "Senador - 2ª vaga", tx: 750, ty: 58},
			{x: arrowsX + 885, y: 30, w: 145, h: 40, i: undefined, s: ind === 5 ? true : false, text: "Governador", tx: 960, ty: 58},
			{x: arrowsX + 1035, y: 30, w: 145, h: 40, i: 1, s: ind === 6 ? true : false, text: "Presidente", tx: 1110, ty: 58},
		]
		
		arrowsData.forEach((data) => {arrow(data.x, data.y, data.w, data.h, data.i, data.s, data.text, data.tx, data.ty)});
	}

	function telaFooter(canvas, ctx, type) {
		let ypos = 700;
		ctx.fillStyle = "black";
		ctx.beginPath();
		ctx.lineTo(70, 650);
		ctx.lineTo(1210, 650);
		ctx.lineTo(1210, 645);
		ctx.lineTo(70, 645);
		ctx.closePath();
		ctx.fill();
		ctx.font = `${h3}px Arial`;
		ctx.textAlign = "center";
		if(type === 0) ctx.fillText("Aperte a tecla CONFIRMA para confirmar o seu voto", canvas.width / 2, ypos);
		ctx.fillText("Aperte a tecla CORRIGE para reiniciar o seu voto", canvas.width / 2, ypos + 50);
		ctx.font = `bold ${h3}px Arial`;
		ctx.fillStyle = "green";
		if(type === 0) ctx.fillText("CONFIRMA", 538, ypos);
		ctx.fillStyle = "#ff5100";
		ctx.fillText("CORRIGE", 550, ypos + 50);
	}

	function digitos(canvas, ctx, x) {
		for(let i = 0; i < x; i++) {
			ctx.strokeRect(60 * (i + 1) + (i * 10), 240, 60, 90);
		};
	}

	function tela0(canvas, ctx) {
		ctx.font = `${h2}px Arial`;
		ctx.fillStyle = "black";
		ctx.fillText("Urna pronta para receber o seu voto", canvas.width / 2, 200);
		ctx.fillText("Use o teclado numérico", canvas.width / 2, 200 + (h1 * 3));
		ctx.fillText("para digitar o seu voto", canvas.width / 2, 200 + (h1 * 4.5));
		ctx.font = `${h3}px Arial`;
		ctx.fillStyle = "black";
		ctx.fillText("Aperte a tecla CONFIRMA para iniciar o seu voto", canvas.width / 2, 650);
		ctx.font = `bold ${h3}px Arial`;
		ctx.fillStyle = "green";
		ctx.fillText("CONFIRMA", 569, 650);
	}

	function telaMain(canvas, ctx, i) {
		ctx.font = `bold ${h2}px ${font}`;
		ctx.fillStyle = "black";
		ctx.textAlign = "left";
		ctx.fillText(candidatoTypes[i - 1], 60, 200);
		digitos(canvas, ctx, candidatoMaxDigits[i - 1]);
	}
	
	function telaLimpar(canvas, ctx) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	function digitar(num) {
		if(telaAtual === 0) return;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		ctx.font = `90px ${font}`;
		ctx.fillStyle = "black";
		ctx.textAlign = "center";
		let candidatoNumero;
		let candidatoType;
		let setCandidatoNumero;
		let setCandidatoValid;
		let maxDigits = candidatoMaxDigits[telaAtual - 1];
		if(telaAtual === 1) {
			candidatoNumero = DF;
			candidatoType = `DF`;
			setCandidatoNumero = setDF;
			setCandidatoValid = setDFValid;
		} else if(telaAtual === 2) {
			candidatoNumero = DE;
			candidatoType = `DE`;
			setCandidatoNumero = setDE;
			setCandidatoValid = setDEValid;
		} else if(telaAtual === 3) {
			candidatoNumero = S1;
			candidatoType = `S1`;
			setCandidatoNumero = setS1;
			setCandidatoValid = setS1Valid;
		} else if(telaAtual === 4) {
			candidatoNumero = S2;
			candidatoType = `S2`;
			setCandidatoNumero = setS2;
			setCandidatoValid = setS2Valid;
		} else if(telaAtual === 5) {
			candidatoNumero = GO;
			candidatoType = `GO`;
			setCandidatoNumero = setGO;
			setCandidatoValid = setGOValid;
		} else if(telaAtual === 6) {
			candidatoNumero = PR;
			candidatoType = `PR`;
			setCandidatoNumero = setPR;
			setCandidatoValid = setPRValid;
		};
		if(candidatoNumero && candidatoNumero.length >= maxDigits) return;
		let newNumber = `${candidatoNumero + num}`;
		setCandidatoNumero(newNumber);
		ctx.fillText(num, 90 + (candidatoNumero ? candidatoNumero.length * 70 : 0), 320);
		const audio = new Audio("/tecla-urna.mp3");
		audio.play();
		function buscarCandidato(num) {
			const candidato = candidatos[candidatoType].find(candidato => candidato.numero == num);
			return candidato ? candidato : null;
		}
		if(candidatoNumero) {
			if(newNumber.length === maxDigits) {
				let candidato = buscarCandidato(parseInt(newNumber));
				ctx.fillStyle = "black";
				ctx.textAlign = "left";
				ctx.font = `${h3}px ${font}`;
				if(candidato) {
					setCandidatoValid(true);
					ctx.fillText(candidato.nome, 60, 400);
					const img = new Image();
					img.src = candidato.imagem;
					img.onload = () => {
						ctx.strokeWidth = "5px";
						ctx.strokeRect(930, 160, 300, 300);
						ctx.drawImage(img, 930, 160, 300, 300);
					};
					telaFooter(canvas, ctx, 0);
				} else {
					setCandidatoNumero("Nulo");
					setCandidatoValid(true);
					ctx.fillText("NÚMERO ERRADO", 60, 400);
					ctx.font = `64px ${font}`
					ctx.textAlign = "center";
					ctx.fillText("VOTO NULO", canvas.width / 2, 600);
					telaFooter(canvas, ctx, 0);
				}
			}
		}
	}
	
	function branco() {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if(telaAtual === 0) return;
		let candidatoNumero;
		let setCandidatoNumero;
		let setCandidatoValid;
		if(telaAtual === 1) {
			candidatoNumero = DF;
			setCandidatoNumero = setDF;
			setCandidatoValid = setDFValid;
		} else if(telaAtual === 2) {
			candidatoNumero = DE;
			setCandidatoNumero = setDE;
			setCandidatoValid = setDEValid;
		} else if(telaAtual === 3) {
			candidatoNumero = S1;
			setCandidatoNumero = setS1;
			setCandidatoValid = setS1Valid;
		} else if(telaAtual === 4) {
			candidatoNumero = S2;
			setCandidatoNumero = setS2;
			setCandidatoValid = setS2Valid;
		} else if(telaAtual === 5) {
			candidatoNumero = GO;
			setCandidatoNumero = setGO;
			setCandidatoValid = setGOValid;
		} else if(telaAtual === 6) {
			candidatoNumero = PR;
			setCandidatoNumero = setPR;
			setCandidatoValid = setPRValid;
		}


		if(candidatoNumero === null) {
			setCandidatoNumero("Branco");
			setCandidatoValid(true);
			ctx.font = `${h1}px ${font}`;
			ctx.fillText("VOTO EM BRANCO", 60, 400);
			telaFooter(canvas, ctx, 0);
		}
	}
	
	function corrige() {
		if(telaAtual === 0) return;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if(telaAtual === 1) {
			setDF(null);
			setDFValid(false);
			telaLimpar(canvas, ctx);
			telaBase(canvas, ctx);
			telaHeader(canvas, ctx, 1);
			telaMain(canvas, ctx, 1);
		} else if(telaAtual === 2) {
			setDE(null);
			setDEValid(false);
			telaLimpar(canvas, ctx);
			telaBase(canvas, ctx);
			telaHeader(canvas, ctx, 2);
			telaMain(canvas, ctx, 2);
		} else if(telaAtual === 3) {
			setS1(null);
			setS1Valid(false);
			telaLimpar(canvas, ctx);
			telaBase(canvas, ctx);
			telaHeader(canvas, ctx, 3);
			telaMain(canvas, ctx, 3);
		} else if(telaAtual === 4) {
			setS2(null);
			setS2Valid(false);
			telaLimpar(canvas, ctx);
			telaBase(canvas, ctx);
			telaHeader(canvas, ctx, 4);
			telaMain(canvas, ctx, 4);
		} else if(telaAtual === 5) {
			setGO(null);
			setGOValid(false);
			telaLimpar(canvas, ctx);
			telaBase(canvas, ctx);
			telaHeader(canvas, ctx, 5);
			telaMain(canvas, ctx, 5);
		} else if(telaAtual === 6) {
			setPR(null);
			setPRValid(false);
			telaLimpar(canvas, ctx);
			telaBase(canvas, ctx);
			telaHeader(canvas, ctx, 6);
			telaMain(canvas, ctx, 6);
		}
	}
	
	function confirmar() {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if(telaAtual === 0) {
			setTelaAtual(1);
			telaLimpar(canvas, ctx);
			telaBase(canvas, ctx);
			telaHeader(canvas, ctx, 1);
			telaMain(canvas, ctx, 1);
		} else if(telaAtual === 1) {
			if(DFValid === true) {
				setTelaAtual(2);
				telaLimpar(canvas, ctx);
				telaBase(canvas, ctx);
				telaHeader(canvas, ctx, 2);
				telaMain(canvas, ctx, 2);
			}
		} else if(telaAtual === 2) {
			if(DEValid === true) {
				setTelaAtual(3);
				telaLimpar(canvas, ctx);
				telaBase(canvas, ctx);
				telaHeader(canvas, ctx, 3);
				telaMain(canvas, ctx, 3);
			}
		} else if(telaAtual === 3) {
			if(S1Valid === true) {
				setTelaAtual(4);
				telaLimpar(canvas, ctx);
				telaBase(canvas, ctx);
				telaHeader(canvas, ctx, 4);
				telaMain(canvas, ctx, 4);
			}
		} else if(telaAtual === 4) {
			if(S2Valid === true) {
				setTelaAtual(5);
				telaLimpar(canvas, ctx);
				telaBase(canvas, ctx);
				telaHeader(canvas, ctx, 5);
				telaMain(canvas, ctx, 5);
			}
		} else if(telaAtual === 5) {
			if(GOValid === true) {
				setTelaAtual(6);
				telaLimpar(canvas, ctx);
				telaBase(canvas, ctx);
				telaHeader(canvas, ctx, 6);
				telaMain(canvas, ctx, 6);
			}
		} else if(telaAtual === 6) {
			if(PRValid === true) {
				setTelaAtual(7);
				telaLimpar(canvas, ctx);
				telaBase(canvas, ctx);
				ctx.textAlign = "center";
				ctx.fillStyle = "black";
				ctx.font = `340px Arial`;
				ctx.fillText("FIM", canvas.width / 2, 500);
				ctx.fillStyle = "#aaa";
				ctx.font = `70px ${font}`;
				ctx.fillText("VOTOU", 1100, 720);
				ctx.fillStyle = "#dbe2ef";
				ctx.fillRect(40, 740, 1200, 40);
				ctx.fillStyle = "black";
				ctx.font = `24px ${font}`;
				ctx.fillText("Município: 00001 - Minha Cidade   Zona: 0001    Seção: 0001", canvas.width / 2, 770);
				const audio = new Audio("/confirma-urna.mp3");
				audio.play();
			}
		}
	}
	
	function reset() {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		setDF(null);
		setDFValid(false);
		setDE(null);
		setDEValid(false);
		setS1(null);
		setS1Valid(false);
		setS2(null);
		setS2Valid(false);
		setGO(null);
		setGOValid(false);
		setPR(null);
		setPRValid(false);
		setTelaAtual(0);
		telaLimpar(canvas, ctx);
		telaBase(canvas, ctx);
		tela0(canvas, ctx);
	}

	/* Inicialização */
	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		telaBase(canvas, ctx);
		tela0(canvas, ctx);
		
	}, []);

	return (
		<div className="App display-flex">
			<div className="urna display-flex flex-column">
				<div className="urna-inline-border">
					<div>
						<article className="display-flex">
							<div>
								<canvas width={1280} height={800} id="screen" ref={canvasRef}></canvas>
							</div>
							{/*<div>
								<span>Tela atual: {telaAtual}</span><br></br>
								<span>DF: {DF} {DFValid === true ? "✅" : "❌"}</span><br></br>
								<span>DE: {DE} {DEValid === true ? "✅" : "❌"}</span><br></br>
								<span>S1: {S1} {S1Valid === true ? "✅" : "❌"}</span><br></br>
								<span>S2: {S2} {S2Valid === true ? "✅" : "❌"}</span><br></br>
								<span>GO: {GO} {GOValid === true ? "✅" : "❌"}</span><br></br>
								<span>PR: {PR} {PRValid === true ? "✅" : "❌"}</span>
							</div>*/}
						</article>
						<footer className={`urna-footer display-flex`}>
							<header className={`hide-mobile`}>
								<img alt="justica-eleitoral" src="justica-eleitoral.png" width="250"></img>
							</header>
							<main id="keys-main">
								<table>
									<tbody>
										<tr>
											<td>
												<button type="button" className="urna-buttons numbers" onClick={() => {digitar(1)}}>
													<span>1</span>
													<span>⠼⠁</span>
												</button>
											</td>
											<td>
												<button type="button" className="urna-buttons numbers" onClick={() => {digitar(2)}}>
													<span>2</span>
													<span>⣼⠃</span>
												</button>
											</td>
											<td>
												<button type="button" className="urna-buttons numbers" onClick={() => {digitar(3)}}>
													<span>3</span>
													<span>⠼⠉</span>
												</button>
											</td>
											<td>
												<button type="button" className="urna-buttons actions white" onClick={branco}>
													<span>BRANCO</span>
													<span>⠃⠗⠁⠝</span>
												</button>
											</td>
										</tr>
										<tr>
											<td>
												<button type="button" className="urna-buttons numbers" onClick={() => {digitar(4)}}>
													<span>4</span>
													<span>⠼⠙</span>
												</button>
											</td>
											<td>
												<button type="button" className="urna-buttons numbers" onClick={() => {digitar(5)}}>
													<span>5</span>
													<span>⠼⠑</span>
												</button>
											</td>
											<td>
												<button type="button" className="urna-buttons numbers" onClick={() => {digitar(6)}}>
													<span>6</span>
													<span>⠼⠋</span>
												</button>
											</td>
											<td>
												<button type="button" className="urna-buttons actions red" onClick={corrige}>
													<span>CORRIGE</span>
													<span>⠉⠕⠗⠗</span>
												</button>
											</td>
										</tr>
										<tr>
											<td>
												<button type="button" className="urna-buttons numbers" onClick={() => {digitar(7)}}>
													<span>7</span>
													<span>⠼⠛</span>
												</button>
											</td>
											<td>
												<button type="button" className="urna-buttons numbers" onClick={() => {digitar(8)}}>
													<span>8</span>
													<span>⠼⠓</span>
												</button>
											</td>
											<td>
												<button type="button" className="urna-buttons numbers" onClick={() => {digitar(9)}}>
													<span>9</span>
													<span>⠼⠊</span>
												</button>
											</td>
											<td rowSpan="2">
												<button type="button" className="urna-buttons actions green" onClick={confirmar}>
													<span>CONFIRMA</span>
													<span>⠉⠕⠝⠋</span>
												</button>
											</td>
										</tr>
										<tr>
											<td>
											</td>
											<td>
												<button type="button" className="urna-buttons numbers" onClick={() => {digitar(0)}}>
													<span>0</span>
													<span>⠼⠚</span>
												</button>
											</td>
											{/*<td>
												<button type="button" className="urna-buttons actions gray" onClick={reset}>
													<span>RESET</span>
													<span>⠉⠕⠝⠋</span>
												</button>
											</td>*/}
											<td>
											</td>
										</tr>
									</tbody>
								</table>
							</main>
						</footer>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
