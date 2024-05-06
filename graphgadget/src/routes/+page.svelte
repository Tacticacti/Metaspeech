<script lang="ts">
	import FileUploader from './components/FileUploader.svelte'

	function inputFilesChanged(event: CustomEvent) {
		const inputFiles: FileList = event.detail;

		if (inputFiles) {
			for (const f of inputFiles) {
				console.log(f.name);
			}
		}
	}
</script>

<head>
	<title>Graph Gadget</title>
</head>

<body>
	<header>
		<h1>Graph Gadget</h1>
	</header>
	<nav>
		<ul>
			<li>
				<FileUploader on:inputFilesChanged={inputFilesChanged}/>
			</li>

			<li><a href=".">Previous Data</a></li>
		</ul>
	</nav>
	<main>
		<h3>How it works</h3>
		<h2>An intuitive way to visualize your speech metadata</h2>
		<div>
			<div>Upload your data as a TSV, JSON, XLS, or TXT in the correct format</div>
			<div>Select which parameters and graph you want us to create</div>
			<div>See the resulting graph on your browser or download it as a JPEG or PNG</div>
		</div>
		<footer>
			<p>Copyright Graph Gadget</p>
		</footer>
	</main>
</body>
