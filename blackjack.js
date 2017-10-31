$(document).ready(function(){
	Game();
	//location.reload();
});
function Card(i){

	this.number = i;
	if(i <= 52)
		this.type = "spade";
	else{
		if(i <= 104)
			this.type = "heart";
		else{
			if(i <= 156)
				this.type = "club";
			else
				this.type = "diamond";
		}
	}
	switch(this.type){
		case "spade":
			this.point = i % 13 + 1;
			break;
		case "heart":
			this.point = (i - 52) % 13 + 1;
			break;
		case "club":
			this.point = (i - 104) % 13 + 1;
			break;
		default:
			this.point = (i - 156) % 13 + 1;
			break;
	}
	this.show = function(){
		return this.point;
	}
}

function hand(deck,counter){
	this.counter = counter;
	this.deck = deck;
	this.bet = 10;
	this.cards = [];
	this.rValue = 0;
	this.aValue = 0;
	this.dealerValue = 0;
	this.hasPair = false;
	this.isStand = false;
	this.isHard = true;
	this.canDouble = true;
	this.hasDoubled = false;
	this.isBusted = false;
	this.isBlackJack = false;
	this.isChild = false;
	this.betJudge;
	
	this.hit = function(iValue){//hit function
		var card;
		if(iValue != undefined)
			card = new Card(iValue);
		else{
			card = new Card(this.deck.pop());
			if(card.point >= 2 && card.point <=6)
				this.counter.p ++;
			if(card.point >= 10 || card.point == 1)
				this.counter.p --;
		}
		this.cards.push(card);
		
		if(card.point <= 10){
			this.rValue += card.point;
			this.aValue += card.point;
			if(card.point == 1 && this.aValue + 10 <= 21 )//
				this.aValue += 10;
		}
		else{
			this.rValue += 10;
			this.aValue += 10;
		}
		if(this.aValue > 21){
			this.aValue = this.rValue;
			this.isHard = true;
		}
		if(this.aValue < 21 && this.aValue == this.rValue + 10)
			this.isHard = false;
		if(this.rValue > 21){
			this.isStand = true;
			this.isBusted = true;
		}
		if(this.aValue == 21){
			this.rValue = this.aValue;
			this.isHard = false;
			this.isStand = true;
		}
		if(this.rValue == 21){
			this.isStand = true;
			if(this.cards.length == 2)
				this.isBlackJack = true;
		}

		if(this.cards.length == 2 && this.cards[0].point == this.cards[1].point)
			this.hasPair = true;
		this.canDouble = (this.cards.length > 2)? false : true;
	};
	this.double = function(){
		this.bet *= 2;
		this.hit();
		if(this.aValue > this.rValue && this.aValue <= 21)
			this.rValue = this.aValue;
		this.stand();
		this.canDouble = false;
		this.hasDoubled = true;
	}
	this.pair = function(process){
		var childHand1 = new hand(this.deck, counter);
		childHand1.isChild = true;
		childHand1.hit(this.cards[0].number);		
		childHand1.dealerValue = this.dealerValue;
		childHand1.bet = this.bet;
		childHand1.betJudge = this.betJudge;
		process.push(childHand1);
		var childHand2 = new hand(this.deck, counter);
		childHand2.isChild = true;
		childHand2.hit(this.cards[1].number);		
		childHand2.dealerValue = this.dealerValue;
		childHand2.bet = this.bet;
		childHand2.betJudge = this.betJudge;
		process.push(childHand2);
	}
	this.stand = function(){
		if(this.aValue <= 21)
			this.rValue = this.aValue;
		this.isStand = true;
	}
	this.show = function(ele){
		for(i = 0; i< this.cards.length; i ++)
			$(ele).append(this.cards[i].show() + ",");
		$(ele).append(";");
	};
	this.playerDecision = function(process,result){
		if(this.cards.length == 1){
			this.hit();
			if(this.cards[0].point == 1){
				this.stand();
			}
		}
		while(!this.isStand){
			if(this.hasPair == true){
				if(((this.cards[0].point == 2 || this.cards[0].point == 3 || this.cards[0].point == 7) && (this.dealerValue >= 2 && this.dealerValue <= 7))||
					(this.cards[0].point == 8 || this.cards[0].point == 1 )||
					(this.cards[0].point == 6 && (this.dealerValue >=2 && this.dealerValue <= 6))||
					(this.cards[0].point == 4 && (this.dealerValue >=5 && this.dealerValue <= 6))
				){
					if(this.cards[0] == this.cards[1]){
					}
					this.pair(process);
					return;
				}
			}
			if(this.isHard){
				if(this.rValue <= 8){
					this.hit();
					continue;
				}
				if(this.rValue == 9){
					if(this.dealerValue >= 3 && this.dealerValue <= 6 && this.canDouble){
						this.double();
						continue;
					}
					else{
						this.hit();
						continue;
					}
				}
				if(this.rValue == 10){
					if(this.dealerValue >= 2 && this.dealerValue <= 9 && this.canDouble){
						this.double();
						continue;
					}
					else{
						this.hit();
						continue;
					}
				}
				if(this.rValue == 11){
					if(this.dealerValue >= 2 && this.dealerValue <= 10 && this.canDouble){
						this.double();
						continue;
					}
					else{
						this.hit();
						continue;
					}
				}
				if(this.rValue == 12){
					if(this.dealerValue >= 4 && this.dealerValue <= 6){
						this.stand();
						continue;
					}
					else{
						this.hit();
						continue;
					}

				}
				if(this.rValue == 15 && this.isHard == true && this.dealerValue == 10){
					this.rValue = 22;
					this.aValue = 22;
					this.bet /= 2;
					this.stand();
					continue;
				}
				if(this.rValue == 16 && this.isHard == true && (this.dealerValue == 10 || this.dealerValue == 9 || this.dealerValue == 1)){
					this.rValue = 22;
					this.aValue = 22;
					this.bet /= 2;
					this.stand();
					continue;
				}
				if(this.rValue >= 13 && this.rValue <=16){
					if(this.dealerValue >= 2 && this.dealerValue <= 6){
						this.stand();
						continue;
					}
					else{
						this.hit();
						continue;
					}
				}
				if(this.rValue >= 17){
					this.stand();
					continue;
				}
			}
			else{
				if(this.aValue == 12){
					this.hit();
					continue;
					
				}
				if(this.aValue >= 13 && this.aValue <= 14){
					if(this.dealerValue >= 5 && this.dealerValue <= 6 && this.canDouble){
						this.double();
						continue;
					}
					else{
						this.hit();
						continue;
					}
				}
				if(this.aValue >= 15 && this.aValue <= 16){
					if(this.dealerValue >= 4 && this.dealerValue <= 6 && this.canDouble){
						this.double();
						continue;
					}
					else{
						this.hit();
						continue;
					}
				}
				if(this.aValue == 17){
					if(this.dealerValue >= 3 && this.dealerValue <= 6 && this.canDouble){
						this.double();
						continue;
					}
					else{
						this.hit();
						continue;
					}
				}
				if(this.aValue == 18){
					if(this.dealerValue >= 3 && this.dealerValue <= 6 && this.canDouble){
						this.double();
						continue;
					}
					if(this.dealerValue >= 3 && this.dealerValue <= 6 && !this.canDouble){
						this.stand();
						continue;
					}
					if(this.dealerValue >= 9 || this.dealerValue == 1){
						this.hit();
						continue;
					}
					else{
						this.stand();
						continue;
					}					
				}
				if(this.aValue >= 19){
					this.stand();
					continue;
				}
			}
		}
		result.push(this);
	}
	this.dealerDecision = function(){
		while(!this.isStand){
			if(this.aValue >= 17){
				this.rValue = this.aValue;
				this.stand();
				continue;
			}
			if(this.rValue >= 17){
				this.stand();
				continue;
			}
			if(this.rValue < 17){
				this.hit();
			}
			
		}
	}
	this.beat = function(other){
		if(this.rValue > 21)
			return -this.bet;
		if(this.rValue == 21 && this.isBlackJack == true){
			if(other.rValue == 21 && this.isBlackJack == true)
				return 0;
			else
				return 1.5 * this.bet;
		}
		if(this.rValue <= 21 && other.rValue > 21)
			return this.bet;
		
		else{
			if(this.rValue > other.rValue)
				return this.bet;
			if(this.rValue == other.rValue)
				return 0;
			if(this.rValue < other.rValue)
				return 0-this.bet;
		}
	}
	this.reset = function(){
		this.betJudge =  Math.floor(this.counter.p/(this.deck.position.length/52))
		this.bet = this.betJudge >= 2 ? 10 * (this.betJudge) : 10;
		this.cards = [];
		this.rValue = 0;
		this.aValue = 0;
		this.dealerValue = 0;
		this.hasPair = false;
		this.isStand = false;
		this.isHard = true;
		this.canDouble = true;
		this.hasDoubled = false;
		this.isBusted = false;
		this.isBlackJack = false;
		this.isChild = false;
	}
}

function Deck(){
	this.position = [];
	this.cut = 0;
	this.shouldShuffle = false;
	this.shuffle = function(){
		this.cut = 15 + Math.round(Math.random()*10);//set up the cut point;
		var tempPosition = [];
		this.position = [];
		var drawPosition;
		for(i = 0; i < 208; i++)//initial tempPosition
			tempPosition[i] = i;
		while(tempPosition.length > 0){
			if(tempPosition.length == 1)
				this.position.push(tempPosition.pop());
			else{
				drawPosition = Math.floor(tempPosition.length * Math.random());
				this.position.push(tempPosition[drawPosition]);
				tempPosition.splice(drawPosition,1);
			}
		}
		this.shouldShuffle = false;
	}
	this.pop = function(){
		if(this.position.length < this.cut)
			this.shouldShuffle = true;
		return this.position.pop();
	}
	this.shuffle();
}
function Counter(){
	this.p = 0;
}
function Game(){
	var deck = new Deck();	
	var process = [];
	var result = [];
	var j;
	var beResult = 0;
	var counterMain = new Counter();
	var player = new hand(deck,counterMain);
	var dealer = new hand(deck,counterMain);
	for(j=0;j<200;j++){
		//console.log(counterMain);
		var process = [];
		var result = [];
		player.reset();
		dealer.reset();
		player.hit();
		dealer.hit();
		player.dealerValue= dealer.cards[0].point > 10 ? 10 : dealer.cards[0].point;
		player.hit();
		dealer.hit();
		process.push(player);
		var playerBeingProcessed;
		while(process.length > 0){
			playerBeingProcessed = process.pop();
			playerBeingProcessed.playerDecision(process, result);
		}		
		dealer.dealerDecision();
		while(result.length > 0){
			playerBeingProcessed = result[result.length-1];
			result.pop();
			$("#display").append(playerBeingProcessed.beat(dealer) + "; Player: ");
			playerBeingProcessed.show("#display");
			$("#display").append(" Dealer: ");
			dealer.show("#display");
			$("#display").append(" result: " + playerBeingProcessed.rValue + " vs " + dealer.rValue + ";");
			if(playerBeingProcessed.isChild == true)
				$("#display").append("P;");
			else
				$("#display").append("NP;");
			$("#display").append(counterMain.p +";" + playerBeingProcessed.betJudge + "<br/>");
			beResult += playerBeingProcessed.beat(dealer);
		}
		result = [];
		if(deck.shouldShuffle){
			deck.shuffle();
			counterMain.p = 0;
			this.betJudge = 0;
		}
		
	}
	$("#result").append( beResult/j);
	console.log(beResult/j);
}