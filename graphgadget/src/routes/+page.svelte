<script lang="ts">
	let inputFile: HTMLInputElement;

	function uploadDataClick() {
		alert(inputFile.files[0].name);
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
				<input bind:this={inputFile} on:change={uploadDataClick} type="file" id="upload-data" hidden />
				<label for="upload-data">Upload Data</label>
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
