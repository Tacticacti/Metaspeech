<script lang="ts">
    
    let description = "nothing"
    let name = "nothing"
    function handleMouseOut() {
        name = "nothing";
        description = "nothing";
    }
</script>


<div class="main-container" >
    <div class="right-container">
        <div data-testid="name-chart" class="name-chart">
            {name}
        </div>
        <div data-testid="description-chart" class="description-chart">
            {description}
        </div>
    </div>
    <div class="left-container">
        <h1 style="text-align:center;">Select a graph</h1>
        <div class="t1">
            <div class="r">
                <div data-testid="histogram" class="s" on:mouseover={() => {
                    name = "Histogram";
                    description = "Histogram description";
                }} on:mouseout={handleMouseOut} >
                    <img src="histogram-img.png" style="background-color: gray;" alt="Description of the image">
                    <div style="align-self:center; font-size: 20px; font-weight: bold;" >histogram</div>
                </div>
                <div class="s">bb</div>
            </div>
            <div class="r">
                <div class="s">cc</div>
                <div class="s">dd</div>
            </div>
        </div>
    </div>
</div>

<style>
    .s:hover {
        background-color: gray;
    }
    .s {
        width: 200px;
        height: 50px;
        padding: 5px;
        border: 1px solid gray;
        border-radius: 5px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
    }
    .r {
        padding: 10px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
    }
    .t1 {
        height: 80vh;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
    }
    .main-container {
        height: 98vh;
        border: 2px solid red;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
      }
    .right-container {
        background-color: aqua;
        align-self: center;
        width: 50vh;
        height: 90vh;
    }
    .left-container {
        width: 700px;
        align-self: center;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: space-around;
    }
</style>