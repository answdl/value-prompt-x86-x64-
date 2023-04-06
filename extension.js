// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let x86_x64 = vscode.languages.registerHoverProvider({ scheme: '*', language: '*' }, {
		provideHover(document, position, token) {

			const text = document.getText();//获取整个文档
			var lineArray = text.split("\r\n", position.line + 1);//将文档按换行符进行分组
			var line = lineArray[lineArray.length - 1];//获取鼠标所在的行
			//判断是否为单字符
			//ascii
			if (position.character < (line.length - 1) && position.character > 0) {//单字符 'a' 有3个符号
				var first = line[position.character - 1];
				var last = line[position.character + 1];
				//Ascii
				if (first == '\'' && last == '\'') {
					return new vscode.Hover(show(line[position.character].charCodeAt(0)));
				}
			}

			var range = document.getWordRangeAtPosition(position);
			const word = document.getText(range);

			if (word.length == 1 && position.character == (line.length - 1)) {
				//Ascii
				if (line[position.character] == '\'' && position.character >= 2 &&
					line[position.character - 2] == '\'') {
					return new vscode.Hover(show(line[position.character - 1].charCodeAt(0)));
				}
			}

			if (/^0[xXhH][0-9a-fA-F]{1,}$/g.test(word) ||
				/^[0-9a-fA-F]{1,}[hH]$/g.test(word)) {
				// Hex
				return new vscode.Hover(show(parseInt(word, 16)));
			} else if (
				/^[0-9]{1,}$/g.test(word) ||
				/^[0-9]{1,}[dD]$/g.test(word) ||
				/^0[dD][0-9]{1,}$/g.test(word)) {
				// Dec
				if (word[1] == 'd' || word[1] == 'D') {
					return new vscode.Hover(show(parseInt(word.slice(2), 10)));
				} else {
					return new vscode.Hover(show(parseInt(word, 10)));
				}
			} else if (
				/^[0-9]{1,}[OoQq]$/g.test(word) ||
				/^0[OoQq][0-9]{1,}$/g.test(word)) {
				// Oct
				if (word[1] == 'o' || word[1] == 'O' || word[1] == 'q' || word[1] == 'Q') {
					return new vscode.Hover(show(parseInt(word.slice(2), 8)));
				} else {
					return new vscode.Hover(show(parseInt(word, 8)));
				}
			} else if (
				/^[01]{1,}[bB]$/g.test(word) ||
				/^0[bB][01]{1,}$/g.test(word) ||
				/^[01]+([_]?[01]+){1,}[bB]$/g.test(word) ||
				/^0[bB][01]+([_]?[01]+){1,}$/g.test(word)) {
				// Bin
				if (word[1] == 'b' || word[1] == 'B') {
					return new vscode.Hover(show(parseInt(word.replace("_", "").slice(2), 2)));
				} else {
					return new vscode.Hover(show(parseInt(word.replace("_", ""), 2)));
				}
			}

			return null;
		}
	});
	context.subscriptions.push(x86_x64);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}

function show(dec) {
	var hex = dec.toString(16).toLocaleUpperCase();
	var oct = dec.toString(8);
	var bin = dec.toString(2);
	var _dec = 0;//不为0时就可以是负数
	//判断是否可以为负数
	switch (bin.length) {
		case 8: case 16: case 32: case 64:
			if (bin[0] === '1') {//负数
				var _bin = (dec - 1).toString(2);
				var bin_ = "0";
				for (let index = 1; index < _bin.length; index++) {
					bin_ += _bin[index] === '1' ? '0' : '1';
				}
				_dec = -parseInt(bin_, 2);
			}
			break;
		default:
			break;
	}
	var str = "";
	str += 'Hex\t:\t' + hex + '\n\n';
	str += 'Dec\t:\t' + dec + (_dec ? (" (" + _dec + ")") : "") + '\n\n';
	str += 'Oct\t:\t' + oct + '\n\n';
	str += 'Bin\t:\t' + bin + '\n\n';
	if (hex.length <= 2) {
		if (dec >= 33 && dec <= 126) {
			// 可显示字符
			var ascii = String.fromCharCode(dec);
			str += 'Ascii\t:\t' + ascii + " (默认字符)" + '\n\n';
		} else {
			var array = [
				"NUL(NULL) 空字符"
				, "SOH(Start Of Headling) 标题开始"
				, "STX(Start Of Text) 正文开始"
				, "ETX(End Of Text) 正文结束"
				, "EOT(End Of Transmission) 传输结束"
				, "ENQ(Enquiry) 请求"
				, "ACK(Acknowledge) 回应/响应/收到通知"
				, "BEL(Bell) 响铃"
				, "BS(Backspace) 退格"
				, "HT(Horizontal Tab) 水平制表符"
				, "LF/NL(Line Feed / New Line) 换行键"
				, "VT(Vertical Tab) 垂直制表符"
				, "FF/NP(Form Feed / New Page) 换页键"
				, "CR(Carriage Return) 回车键"
				, "SO(Shift Out) 不用切换"
				, "SI(Shift In) 启用切换"
				, "DLE(Data Link Escape) 数据链路转义"
				, "DC1/XON(Device Control 1 / Transmission On) 设备控制1/传输开始"
				, "DC2(Device Control 2) 设备控制2"
				, "DC3/XOFF(Device Control 3 / Transmission Off) 设备控制3/传输中断"
				, "DC4(Device Control 4) 设备控制4"
				, "NAK(Negative Acknowledge) 无响应/非正常响应/拒绝接收"
				, "SYN(Synchronous Idle) 同步空闲"
				, "ETB(End of Transmission Block)传输块结束/块传输终止"
				, "CAN(Cancel) 取消"
				, "EM(End of Medium) 已到介质末端/介质存储已满/介质中断"
				, "SUB(Substitute) 替补/替换"
				, "ESC(Escape) 逃离/取消"
				, "FS(File Separator) 文件分割符"
				, "GS(Group Separator) 组分隔符/分组符"
				, "RS(Record Separator) 记录分离符"
				, "US(Unit Separator) 单元分隔符"
				, "(Space) 空格"
				, "DEL(Delete) 删除"
			];
			if (dec < 33) {
				str += 'Ascii\t:\t' + array[dec] + '\n\n';
			} else if (dec == 127) {
				str += 'Ascii\t:\t' + array[array.length - 1] + '\n\n';
			} else {
				// 可显示扩展字符
				var ascii = String.fromCharCode(dec);
				str += 'Ascii\t:\t' + ascii + " (扩展字符)" + '\n\n';
			}
		}
	}
	return str;
}
