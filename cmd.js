cmd = function(user,directory,access)
{
	this.user   = user;
	this.cmd_dir= directory;
	this.access = access;
	this.dir	= '~';
	this.commands = new Array();
		this.commands = ['ls','clear'];
	this.input_history = new Array();
	this.last = 0;
};

cmd.prototype.prompt = function()
{
	this.prompt_text = this.user+"@"+document.domain.replace(/^www./i,'')+":"+this.dir+this.access;
	var prompt = document.createElement('span');
	prompt.style.color					= 'gray';
	prompt.style.marginRight			= '2px';
	prompt.innerHTML					= this.prompt_text;
	return prompt;
};

cmd.prototype.ajax = function()
{
	try {
		return new ActiveXObject('Msxml2.XMLHTTP')
	} catch (e) {
		try {
			return new ActiveXObject('Microsoft.XMLHTTP')
		} catch (e) {
			return new XMLHttpRequest();
		}
	}
};

cmd.prototype.ajax_get = function(url)
{
	var get = this.ajax();
	get.open('GET',url,false);
	get.send(null);
	return get.responseText;
};

cmd.prototype.json = function(url)
{
	try {
		var data = this.ajax_get(url);
			if(data=='')
				return {'response':'command '+this.last_command+': not working properly'};
		return eval('('+data+')');
	} catch (e) {
		return {'response':'bash: '+this.last_command+': command not found'};
	}
};

cmd.prototype.run_cmd = function(command,args)
{
	command = command.replace(/(..\/|.\/|\.|\/)/ig,'');
	var json = this.json(this.cmd_dir+'/'+command+'.php?'+args.join('&'));
	return json.response;
};

cmd.prototype.list = function()
{
	var commands = this.json('command_list.php');
	return commands.commands.concat(this.commands);
};

cmd.prototype.join = function(array,start,end)
{
	var r = new Array();
	for(var i=start;i<end;i++)
		r.push(array[i]);
	return r;
};

cmd.prototype.ls = function() 
{
	var arr		= this.list();
	var sonsatir = arr.length % 6;
	var toplam = arr.length - sonsatir;
	var satir = toplam / 6;
	if(sonsatir>0)
		satir+=1;
	var tablo = '';
	var s = 0;
	for(var i=0;i<satir;i++)
	{
		tablo += "<tr>";
		for(var j=0;j<6;j++)
		{
			if(typeof arr[s]!='undefined')
				if(arr[s][0]=="*")
					tablo+="<td width='90'><b>"+arr[s].substr(1,arr[s].length)+"</b></td>";
				else
					tablo+="<td width='90'>"+arr[s]+"</td>";
			s++;
		}
		tablo += "</tr>";
	}
	tablo = "<table style='font-size:10pt; font-family:Monospace' cellpadding=0 cellspacing=0>" + tablo + "</table>";
	return tablo;
};

cmd.prototype.run = function()
{
	var command = this.command_input.value.split(' ');
	this.input_history.push(this.command_input.value);
	this.last = this.input_history.length;
	this.last_command = command[0];
	this.command = command[0];
	this.command_input.value;
	
	switch(this.command) 
	{
	case 'clear':
		return this.history_div.innerHTML='';
		break;	
	
	case 'ls':
		return this.ls();
		break;
		
	case '':
		return null;
		break;
		
	default:
		return this.run_cmd(this.command,this.join(command,1,command.length));
	}

};

cmd.prototype.create_terminal = function()
{
	var _this = this;
	
	document.body.style.backgroundColor = '#FFFFFF';
	document.body.style.margin			= '8px';
	document.body.style.fontFamily		= 'Monospace';
	document.body.style.fontSize		= '10pt';
	

	var terminal  = document.createElement('div');
	terminal.style.overflowX			= 'hidden';
	terminal.style.whiteSpace			= 'nowrap';
	document.body.appendChild(terminal);
	
	var history   = document.createElement('div');
	terminal.appendChild(history);
	this.history_div   = history;
	
	
	var cmd_input = document.createElement('input');
	cmd_input.setAttribute				  ('type','text');
	cmd_input.setAttribute				  ('maxlength','100');
	cmd_input.setAttribute				  ('size','120');
	cmd_input.style.fontFamily			= 'Monospace';
	cmd_input.style.backgroundColor		= 'transparent';
	cmd_input.style.border				= '0px';
	cmd_input.style.outline				= '0px';
	cmd_input.style.padding				= '0px';
	cmd_input.style.fontSize			= '10pt';
	cmd_input.onkeydown					= function(event)
	{
		if(typeof event=='undefined')
			event = window.event;
		
		if(event.keyCode==13)
			_this.submit();
		
		if(event.keyCode==38)//yukari
		{
			if(_this.last>0)
				_this.last--;
			this.value = _this.input_history[_this.last];
		}
		
		if(event.keyCode==40)//asagi
		{
			if(_this.last<(_this.input_history.length-1))
				_this.last++;
			this.value = _this.input_history[_this.last];
		}
	};
	
	var anchor = document.createElement('a');
	anchor.setAttribute('name','_');
	
	terminal.appendChild(this.prompt());
	terminal.appendChild(cmd_input);
	terminal.appendChild(anchor);

	document.title = this.prompt_text;
	
	this.command_input = cmd_input;
};

cmd.prototype.submit = function()
{
	var prompt = document.createElement('div');
	prompt.appendChild(this.prompt());
	prompt.innerHTML += '<span style="margin-left:1px;">'+this.command_input.value+'</span>';
	var response = document.createElement('div');
	response.innerHTML = this.run();
	if(this.command!='clear')
	{
		this.history_div.appendChild(prompt);
		this.history_div.appendChild(response);
	}
	window.location.href='#_';
	this.command_input.focus();
	this.command_input.value = '';
};

window.onerror = function(a,b,c,d) 
{
	alert(a+"\n"+b+"\n"+c+"\n"+d);
	return true;
};

window.onload = function()
{
	var terminal_obj = new cmd('fka','./commands','$');
	terminal_obj.create_terminal();
	terminal_obj.command_input.focus();
	document.onclick = function()
	{
		terminal_obj.command_input.focus();
	};
};
