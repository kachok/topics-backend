function edit_panel_save()
{
	$("#edit-panel").hide();
	return false;
}

function edit_panel_cancel()
{
	$("#edit-panel").hide();
	return false;
	
}


function get_word(typeindex, vocabulary){
	for (var word in vocabulary){
		if (vocabulary[word]["typeindex"]==typeindex){
			return vocabulary[word]["word"];
		}
	}
	return "";
}		

function get_doc(doc, documents){
	for (var d in documents){
		if (documents[d]["document"]==doc){
			return documents[d]["source"];
		}
	}
	return "";
}		


function add_topic(topic)
// Function adds row with topic content into table (including all data bindings to DOM elements)
{
	var topicindex=topic["topicindex"];

	var wrds="";
	wrds2="";
	var words = topic["words"];

	for (var w in words) {
		var lookup=get_word(words[w]["word"],vocab);
		
		wrds=wrds+lookup+" ";
		wrds2=wrds2+'<a href="#" draggable="true" class="label">'+lookup+'</a> ';
	}

	var dcs="";
	var documents = topic["docs"];
	for (var d in documents) {
		var lookup=get_doc(documents[d], docs);
		dcs=dcs+lookup+"; ";
	}

	//var tbl="<tr id='topic-"+topicindex+"'><td class='topicname'>"+topic["topic"]+"</td><td>"+wrds+"</td><td>"+dcs+"</td></tr>";
	//$("#datatable > tbody").append(tbl);
	//$("#allWords").html($("#allWords").html()+wrds2);
	
	
	var html="";
	html=html+'<hr style="width:100%"/>';
	html=html+'<div class="row data-item"  id="topic-'+topicindex+'">';
	html=html+'	<div class="span16  unread">';
	html=html+'	<div class="row">';
	html=html+'	<div class="span4 topic">'+topic["topic"]+'</div>';
	html=html+'	<div class="span8 words">'+wrds+'</div>';
	html=html+'	<div class="span4 documents">'+dcs+'</div>';
	html=html+'	</div>';

	html=html+'	</div>';
	html=html+'</div>';

	//alert(html);
	$(html).insertBefore("#done");

	/*
	<hr style="width:100%"/>
	<div class="row">
		<div class="span16  unread">
			<div class="row">
				<div class="span4 topic">Topic 01</div>
				<div class="span8 words">feds admit double counting talking health care billion medicare fund parts money reference healthcare reform prescription medicare latimes http medicare vouchers</div>
				<div class="span4 documents">1305159433902. csv_Apr_23_19347237267; 1305159433902. csv_Apr_24_19370682750; </div>
			</div>
		</div>
	</div>	
	*/
	
	
	
	//attach topic data to tr element
	$("#topic-"+topicindex).data("topic",topic);
	//attach edit event to tr element (to open large editing panel)

	$("#topic-"+topicindex).click({id:"#topic-"+topicindex, wrds:wrds2},function(e) {
		//alert("insert");
		$(e.data.id+">div").removeClass("unread");
		$(e.data.id+">div").addClass("read");
		//$(e.data.id+">div").addClass("selected");
		
		$("#edit-panel").insertAfter(e.data.id);
		$("#edit-panel").show();
		
		//$("#edit-panel").modal({keyboard:true, backdrop:"static", show:false});
		//$("#edit-panel").modal('show');
		
		$("#all-words").html(e.data.wrds);
		$("#important-words").html("");
		$("#ignored-words").html("");
		
		//permissionForm.init2();
		permissionForm.reinit();		
		
	});
	
	//attcha events to topic name for inline editing
	$("#topic-"+topicindex+" .topic").click({id:"#topic-"+topicindex, topicname:topic["topic"]},function(e) {
		//alert("topic name: "+e.data.topicname+" clicked");
		
		$(e.data.id+" .topic").html("<input id='topicnameinlineeditor' value='"+e.data.topicname+"'> </input>");

		$(e.data.id+" .topic>input").blur({id:e.data.id}, function(e)
		{
			$(e.data.id+"  .topic").html($(e.data.id+" .topic>input").val());
		});
		
		$(e.data.id+"  .topic>input").focus();
		return false;
		
	});
	
	
}

function render_input(json)
{
	//alert("magic rendering here!");
	
	//save vocabulary and documents to global variables
	docs=json.documents;
	vocab=json.vocabulary;
	

	var tbl="";

	var wrds2="";

	var topics = json.topics;
	for (var t in topics) {
		//alert(t+ " - "+ topics[t]["topic"]); 

		//alert("add topic");
		add_topic(topics[t]);
		
	}


}

function load_input()
{
	$.getJSON("static/data/input.json", function(json) {
    	alert("JSON Data: " + json);
    	render_input(json);
    }); 
}

function setup_autocomplete()
{
	
	//debugger;
	var availableTags = [
	];
	
	for (word in vocab){
		availableTags.push(vocab[word].word);
		
	}
		
			$( "#tags" ).autocomplete({
				source: availableTags,
				minLength:2
			});

			$("#add-tag").click(function(){
				//alert("click!");
				$("#all-words").append('<a href="#" draggable="true" class="label">'+$("#tags").val()+'</a> ')
				
				$("#tags").val("");
				
				
				return false;
			});
	

}

function generate_output(){
	var dataNodes = $('.data-item');
	//debugger;
	output="";
	
	for (var i=0; i<dataNodes.length; i++) {
		var orig=$('#'+dataNodes[i].id).data().topic.topic;
		var mod=$('#'+dataNodes[i].id+" > .span16 > .row > .topic")[0].innerHTML;
		output=output+" "+orig+":"+mod+", ";
	}	

}

function onload_stuff()
{
	$("#edit-panel-save").click(function(){ 
		edit_panel_save(); 
		return false;
	});
	
	$("#edit-panel-cancel").click(function(){ 
		edit_panel_cancel();  
		return false;
	});
	
	$("#done").click(function()
	{
		generate_output();
		//alert(output);
		//return false;
	});
}
