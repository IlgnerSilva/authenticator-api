import fs from 'node:fs';
import path from 'node:path';

// Diretório a ser lido
const srcDir = path.join(__dirname, 'src');
// Arquivo de saída
const outputFilePath = path.join(__dirname, 'merged-files.txt');

// Função para ler todos os arquivos recursivamente dentro de uma pasta
const readFilesRecursively = (dir: string): string[] => {
	let filePaths: string[] = [];

	const entries = fs.readdirSync(dir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			filePaths = filePaths.concat(readFilesRecursively(fullPath));
		} else {
			filePaths.push(fullPath);
		}
	}

	return filePaths;
};

// Função principal
const mergeFiles = async () => {
	try {
		// Lê todos os arquivos dentro da pasta 'src'
		const filePaths = readFilesRecursively(srcDir);

		let mergedContent = '';

		for (const filePath of filePaths) {
			const relativePath = path.relative(srcDir, filePath); // Caminho relativo a partir de 'src'
			const fileContent = fs.readFileSync(filePath, 'utf-8');

			// Adiciona o título (nome do arquivo) e o conteúdo
			mergedContent += `${relativePath}\n\n${fileContent}\n\n`;
		}

		// Escreve o conteúdo no arquivo de saída
		fs.writeFileSync(outputFilePath, mergedContent, 'utf-8');
		console.log(`Arquivo consolidado criado em: ${outputFilePath}`);
	} catch (error) {
		console.error('Erro ao processar os arquivos:', error);
	}
};

// Executa o script
mergeFiles();
