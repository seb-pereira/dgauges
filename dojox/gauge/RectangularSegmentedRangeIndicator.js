define(["dojo/_base/declare", "dojo/on", "dojox/gfx", "./IndicatorBase"], function(declare, on, gfx, IndicatorBase){
	/*=====
     var IndicatorBase = dojox.gauge.IndicatorBase;
     =====*/
	return declare("dojox.gauge.RectangularRangeIndicator", IndicatorBase, {
		start: 0,
		startWeight: 10,
		endWeight: 10,
		fill: null,
		stroke: null,
		paddingLeft: 0,
		paddingTop: 0,
		paddingRight: 0,
		paddingBottom: 0,
		
		// segments: Number
		//		The number of segments making the indicator.
		//		By default it is 10.
		segments: 10,

		// segmentSpacing: Number
		//		The blank space between two segments. The default value is 2
		segmentSpacing: 2,
		
		// rounded: Boolean
		//		Indicates if the extremity segments are rounded.
		//		Default is true.		
		rounded: true,
		
		// ranges: Object
		//
		ranges: null,
		
		constructor: function(){
			//	summary:
			//		Constructor.
			//	description:
			//		Creates a segmented range indicator.
			this.fill = [255, 120, 0];
			this.stroke = {
				color: 'black',
				width: .2
			};
			
			this.addInvalidatingProperties(["start", "startWeight", "endWeight", "fill", "stroke","segments","segmentSpacing","ranges"]);
		},

		_defaultHorizontalShapeFunction: function(indicator, group, scale, startX, startY, endPosition, startWeight, endWeight, fill, stroke){
			var length = scale._contentBox.w ;
			if(this.ranges){				
				// Configure gradient to represent the ranges
				fill = {type:"linear", colors:[]};				
				fill.x1 = startX;
				fill.y1 = startY;
				fill.x2 = startX + length;
				fill.y2 = startY;
				
				var rangeStart = 0;
				
				for(var i = 0; i < this.ranges.length; i++){
					var entry1 = {
						color:this.ranges[i].color,
						offset: scale.scaler.positionForValue(rangeStart)
					};
					var entry2 = {
						color:this.ranges[i].color,
						offset: scale.scaler.positionForValue(rangeStart+this.ranges[i].size)
					};
					fill.colors.push(entry1);
					fill.colors.push(entry2);
					rangeStart += this.ranges[i].size;
				}
			}else if (fill && fill.colors){
				// Configure gradient
				fill.x1 = startX;
				fill.y1 = startY;
				fill.x2 = startX + length;
				fill.y2 = startY;
			}
			
			var shape, i,gp,radius;
			var x = startX;
			var y = startY;
            var chicklet = (length / this.segments) - this.segmentSpacing;
			var visibleSegments = Math.abs( (endPosition - startX) / (chicklet+this.segmentSpacing) );
			var sw = this.startWeight;
			var inc = (this.endWeight - this.startWeight) /this.segments
			var ew = sw+inc;			
			var remain = visibleSegments - Math.floor(visibleSegments);
			
			
            for(i = 0; i < Math.floor(visibleSegments); i++){
				var path = group.createPath();
                
                if(i == 0 && this.rounded && (sw/2) < chicklet){ // first segment rounded
					radius = sw/2;
                    path.moveTo(x + radius, y);
                    path.lineTo(x + chicklet, y);
                    path.lineTo(x + chicklet, y + ew);
                    path.lineTo(x + radius, y + sw);
                    path.arcTo(radius, radius, 0, 0, 1, x + radius, y)
                }else{
                    if(i == Math.floor(visibleSegments) - 1 && (remain == 0) && this.rounded && (ew/2) < chicklet){ // last segment rounded
						radius = ew/2;
                        path.moveTo(x, y);
                        path.lineTo(x + chicklet - radius, y);
                        path.arcTo(radius, radius, 0, 0, 1, x + chicklet - radius, y + ew)
                        path.lineTo(x, y + sw);
                        path.lineTo(x, y);
                    }else{
                        path.moveTo(x, y);
                        path.lineTo(x + chicklet, y);
                        path.lineTo(x + chicklet, y + ew);
                        path.lineTo(x, y + sw);
                        path.lineTo(x, y);
                    }
				}
				
				path.setFill(fill).setStroke(stroke);
				sw = ew;
				ew += inc;
                x += chicklet + this.segmentSpacing;
            }
			
			// draw the remaining segment part
			if(remain > 0){
				ew = sw+( (ew-sw)*remain );
				var gp = [x, y, x+(chicklet*remain), y, x+(chicklet*remain), y  + ew, x, y + sw, x, y]
				shape = group.createPolyline(gp).setFill(fill).setStroke(stroke);
			}		
			
			return shape;
		},

		_defaultVerticalShapeFunction: function(indicator, group, scale, startX, startY, endPosition, startWeight, endWeight, fill, stroke){
			var length = scale._contentBox.h ;
			if(this.ranges){				
				// Configure gradient to represent the ranges
				fill = {type:"linear", colors:[]};				
				fill.x1 = startX;
				fill.y1 = startY;
				fill.x2 = startX;
				fill.y2 = startY + length;
				
				var rangeStart = 0;
				
				for(var i = 0; i < this.ranges.length; i++){
					var entry1 = {
						color:this.ranges[i].color,
						offset: scale.scaler.positionForValue(rangeStart)
					};
					var entry2 = {
						color:this.ranges[i].color,
						offset: scale.scaler.positionForValue(rangeStart+this.ranges[i].size)
					};
					fill.colors.push(entry1);
					fill.colors.push(entry2);
					rangeStart += this.ranges[i].size
				}
			}else if (fill && fill.colors){
				// Configure gradient
				fill.x1 = startX;
				fill.y1 = startY;
				fill.x2 = startX;
				fill.y2 = startY + length;
			}			
			
			var shape, i,gp,radius;
			var x = startX;
			var y = startY;
            var chicklet = (length / this.segments) - this.segmentSpacing;
			var visibleSegments = Math.abs( (endPosition - startY) / (chicklet+this.segmentSpacing) );
			var sw = this.startWeight;
			var inc = (this.endWeight - this.startWeight) /this.segments
			var ew = sw+inc;			
			var remain = visibleSegments - Math.floor(visibleSegments);
			
            for(i = 0; i < Math.floor(visibleSegments); i++){
				var path = group.createPath();
                
                if(i == 0 && this.rounded && (sw/2) < chicklet){ // first segment rounded
					radius = sw/2;
                    path.moveTo(x , y+ radius);
                    path.lineTo(x , y+ chicklet);
                    path.lineTo(x + ew, y + chicklet);
                    path.lineTo(x + sw, y + radius);
                    path.arcTo(radius, radius, 0, 0, 0, x , y+ radius)
                }else{
                    if(i == Math.floor(visibleSegments) - 1 && (remain == 0) && this.rounded && (ew/2) < chicklet){ // last segment rounded
						radius = ew/2;
                        path.moveTo(x, y);
                        path.lineTo(x , y+ chicklet - radius);
                        path.arcTo(radius, radius, 0, 0, 0, x + ew, y + chicklet - radius)
                        path.lineTo(x+ sw, y );
                        path.lineTo(x, y);
                    }else{
                        path.moveTo(x, y);
                        path.lineTo(x , y+ chicklet);
                        path.lineTo(x + ew, y + chicklet);
                        path.lineTo(x+ sw, y );
                        path.lineTo(x, y);
                    }	
				}

				path.setFill(fill).setStroke(stroke);
				sw = ew;
				ew += inc;
                y += chicklet + this.segmentSpacing;
            }
			
			// draw the remaining segment part
			if(remain > 0){
				ew = sw+( (ew-sw)*remain );
				var gp = [x, y, x, y+(chicklet*remain), x+ ew, y+(chicklet*remain), x+ sw, y , x, y]
				shape = group.createPolyline(gp).setFill(fill).setStroke(stroke);
			}					
			
			return shape;
		},
				
		indicatorShapeFunction: function(indicator, group, scale, startX, startY, endPosition, startWeight, endWeight, fill, stroke){
			//	summary:
			//		Constructor.
			//	description:
			//		Creates a segmented range indicator.
			
			if (this.scale._gauge.orientation == "horizontal"){
				this._defaultHorizontalShapeFunction(indicator, group, scale, startX, startY, endPosition, startWeight, endWeight, fill, stroke);
			}else{
				this._defaultVerticalShapeFunction(indicator, group, scale, startX, startY, endPosition, startWeight, endWeight, fill, stroke);
			}
		},
		
		refreshRendering: function(){
		
			if(this._gfxGroup == null || this.scale == null){
				return;
			}
			// gets position corresponding to the values
			var spos = this.scale.positionForValue(this.start);
			var pos = this.scale.positionForValue(this.value);
			this._gfxGroup.clear();
			
			var startX;
			var startY;
			var endPosition;
			if (this.scale._gauge.orientation == "horizontal"){
				startX = spos;
				startY = this.paddingTop;
				endPosition = pos;
			}else{
				startX = this.paddingLeft;
				startY = spos ;
				endPosition = pos;			
			}
			this.indicatorShapeFunction(this, this._gfxGroup, this.scale, startX, startY, endPosition, this.startWeight, this.endWeight, this.fill, this.stroke);
		}
	})
});
