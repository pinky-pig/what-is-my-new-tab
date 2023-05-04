// Heartfelt - by Martijn Steinrucken aka BigWings - 2017
// Email:countfrolic@gmail.com Twitter:@The_ArtOfCode
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

// I revisited the rain effect I did for another shader. This one is better in multiple ways:
// 1. The glass gets foggy.
// 2. Drops cut trails in the fog on the glass.
// 3. The amount of rain is adjustable (with Mouse.y)

// To have full control over the rain, uncomment the HAS_HEART define 

// A video of the effect can be found here:
// https://www.youtube.com/watch?v=uiF5Tlw22PI&feature=youtu.be

// Music - Alone In The Dark - Vadim Kiselev
// https://soundcloud.com/ahmed-gado-1/sad-piano-alone-in-the-dark
// Rain sounds:
// https://soundcloud.com/elirtmusic/sleeping-sound-rain-and-thunder-1-hours


// 定义了名为“S”的宏。接受三个参数：下限“a”，上限“b”和值“t”。返回值介于0和1之间，当t等于a时为0，当t等于b时为1。
#define S(a, b, t) smoothstep(a, b, t)


// 定义了三个不同的宏，用于切换着色器代码的不同部分，或者启用/禁用某些功能
//#define CHEAP_NORMALS
#define HAS_HEART
#define USE_POST_PROCESSING


// 下面各种噪声函数的实现

// 1. 生成3D Perlin
vec3 N13(float p) {
    //  from DAVE HOSKINS
   vec3 p3 = fract(vec3(p) * vec3(.1031,.11369,.13787));
   p3 += dot(p3, p3.yzx + 19.19);
   return fract(vec3((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));
}

// 2. 生成四维噪声值
vec4 N14(float t) {
	return fract(sin(t*vec4(123., 1024., 1456., 264.))*vec4(6547., 345., 8799., 1564.));
}
// 3. 生成一维噪声值
float N(float t) {
    return fract(sin(t*12345.564)*7658.76);
}

// 使用频率为“b”且由“t”确定相位移的锯齿波信号。此函数使用先前定义的“S”宏，允许在两个值之间进行平滑插值
float Saw(float b, float t) {
	return S(0., b, t)*S(1., b, t);
}

// 一个二维向量uv和一个浮点数t，分别表示当前的屏幕坐标和时间
vec2 DropLayer2(vec2 uv, float t) {
    // 变量UV被初始化为输入值uv
    vec2 UV = uv;
    // 接下来更新了uv的y坐标，使其沿着屏幕垂直方向上下移动
    uv.y += t*0.75;
    // 变量a和grid被定义为常量向量，并用于设置网格大小
    vec2 a = vec2(6., 1.);
    vec2 grid = a*2.;
    // 变量id被设置为经过floor函数取整之后的偏移量，以确定当前像素所处的网格单元
    vec2 id = floor(uv*grid);
    
    // 根据id.x计算colShift变量，在当前像素所处的列添加随机偏移量
    float colShift = N(id.x); 
    // 将uv再次更新为它所在的网格编号（通过floor函数获得）以及一个基于Perlin噪声的随机向量
    uv.y += colShift;
    
    id = floor(uv*grid);
    vec3 n = N13(id.x*35.2+id.y*2376.1);
    vec2 st = fract(uv*grid)-vec2(.5, 0);
    // 将x设置为Perlin噪声的x坐标
    float x = n.x-.5;
    
    // 以y=UV.y*20作为输入，计算出一个sin函数输出的wiggle值
    float y = UV.y*20.;
    // 进一步变换x的值，将其乘以0.7并减去一些波动成分，从而得到我们想要呈现的水滴形状。
    float wiggle = sin(y+sin(y));
    x += wiggle*(.5-abs(x))*(n.z-.5);
    x *= .7;
    float ti = fract(t+n.z);
    y = (Saw(.85, ti)-.5)*.9+.5;
    vec2 p = vec2(x, y);
    
    float d = length((st-p)*a.yx);
    
    float mainDrop = S(.4, .0, d);
    
    float r = sqrt(S(1., y, st.y));
    float cd = abs(st.x-x);
    float trail = S(.23*r, .15*r*r, cd);
    float trailFront = S(-.02, .02, st.y-y);
    trail *= trailFront*r*r;
    // 随着时间的推移，计算出每个水滴的轨迹与前景/背景之间的交互，并将其写回m变量中。
    y = UV.y;
    float trail2 = S(.2*r, .0, cd);
    float droplets = max(0., (sin(y*(1.-y)*120.)-st.y))*trail2*trailFront*n.z;
    y = fract(y*10.)+(st.y-.5);
    float dd = length(st-vec2(x, y));
    droplets = S(.3, 0., dd);
    float m = mainDrop+droplets*r*trailFront;
    
    // 最后，函数返回一个二维向量，表示水滴和轨迹的强度。
    //m += st.x>a.y*.45 || st.y>a.x*.165 ? 1.2 : 0.;
    return vec2(m, trail);
}

// 一个二维向量uv和一个浮点数t，分别表示当前的屏幕坐标和时间
float StaticDrops(vec2 uv, float t) {
    // 将输入向量uv乘以40。这将把输入变量按比例缩放到更小的值范围内
	uv *= 40.;
    // 通过floor函数取整之后的偏移量id和fract函数得到uv在当前网格单元中的偏移量
    vec2 id = floor(uv);
    uv = fract(uv)-.5;
    // 根据id.x计算Perlin噪声的变量n，并将其转换为p向量。
    vec3 n = N13(id.x*107.45+id.y*3543.654);
    vec2 p = (n.xy-.5)*.7;
    // 计算uv向量与p向量之间的距离d。
    float d = length(uv-p);
    
    // 使用S函数（即一种平滑阈值函数）计算出水滴形状，并根据Perlin噪声变量n.z中的指定位置来控制波动度。
    float fade = Saw(.025, fract(t+n.z));
    float c = S(.3, 0., d)*fract(n.z*10.)*fade;
    // 最后，函数返回一个浮点数，用于确定像素的强度或颜色值。
    return c;
}

// 一个二维向量uv，一个浮点数t，以及三个浮点数l0、l1和l2分别表示三个水滴层的亮度
vec2 Drops(vec2 uv, float t, float l0, float l1, float l2) {
    // 使用StaticDrops函数计算第一个水滴层s的亮度，并将其乘以l0
    float s = StaticDrops(uv, t)*l0; 
    // 使用DropLayer2函数计算第二个水滴层m1在指定位置uv处的偏移量，然后将其乘以l1。以l2
    vec2 m1 = DropLayer2(uv, t)*l1;
    // 同样，将第三个水滴层m2的结果乘
    vec2 m2 = DropLayer2(uv*1.85, t)*l2;
    // 计算c的值为所有水滴层亮度之和。
    float c = s+m1.x+m2.x;
    // 使用平滑阈值函数S对c进行处理，使值在范围[0, 1]内
    c = S(.3, 1., c);
    // 返回一个二维向量，其中x表示最终混合颜色值，而y表示两个水滴层中高度最大的那个水滴的高度与l0或l1的乘积
    return vec2(c, max(m1.y*l0, m2.y*l1));
}

#iChannel0 "https://raw.githubusercontent.com/rocksdanister/rain/b4bd5be1ea5da0784f9740e850194ea74dd5e1b0/media/image.webp"

// 一个四维向量fragColor用于输出颜色值，以及一个二维向量fragCoord表示当前像素在屏幕上的位置
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // 通过计算uv和UV向量来获取当前像素在纹理坐标系上的位置。
	vec2 uv = (fragCoord.xy-.5*iResolution.xy) / iResolution.y;
    vec2 UV = fragCoord.xy/iResolution.xy;
    // 根据iMouse.xyz/iResolution.xyz计算出鼠标相对于屏幕分辨率的位置，并根据iTime和M.x的计算结果得到T的值。
    vec3 M = iMouse.xyz/iResolution.xyz;
    float T = iTime+M.x*2.;
    
    // 如果定义了HAS_HEART宏，则使用mod函数计算T模102并将其与M.x*102进行混合，否则t的值乘以0.2。
    #ifdef HAS_HEART
    T = mod(iTime, 102.);
    T = mix(T, M.x*102., M.z>0.?1.:0.);
    #endif
    
    
    float t = T*.2;
    // 根据iMouse.z的值是否大于0，计算出雨水的数量rainAmount。
    float rainAmount = iMouse.z>0. ? M.y : sin(T*.05)*.3+.7;
    // 分别计算出最大模糊半径maxBlur和最小模糊半径minBlur。
    float maxBlur = mix(3., 6., rainAmount);
    float minBlur = 2.;
    // 初始化story和heart为0。
    float story = 0.;
    float heart = 0.;
    // 如果定义了HAS_HEART宏，则计算story、zoom、minBlur、maxBlur、heart等参数。如果没有定义，则计算zoom。
    #ifdef HAS_HEART
    story = S(0., 70., T);
    
    t = min(1., T/70.);						// remap drop time so it goes slower when it freezes
    t = 1.-t;
    t = (1.-t*t)*70.;
    
    float zoom= mix(.3, 1.2, story);		// slowly zoom out
    uv *=zoom;
    minBlur = 4.+S(.5, 1., story)*3.;		// more opaque glass towards the end
    maxBlur = 6.+S(.5, 1., story)*1.5;
    
    vec2 hv = uv-vec2(.0, -.1);				// build heart
    hv.x *= .5;
    float s = S(110., 70., T);				// heart gets smaller and fades towards the end
    hv.y-=sqrt(abs(hv.x))*.5*s;
    heart = length(hv);
    heart = S(.4*s, .2*s, heart)*s;
    rainAmount = heart;						// the rain is where the heart is
    
    maxBlur-=heart;							// inside the heart slighly less foggy
    uv *= 1.5;								// zoom out a bit more
    t *= .25;
    #else
    float zoom = -cos(T*.2);
    uv *= .7+zoom*.3;
    #endif


    // 将当前像素的位置uv和drop的时间t传入Drops函数中，计算出一个二维向量c作为混合颜色值。
    UV = (UV-.5)*(.9+zoom*.1)+.5;
    float staticDrops = S(-.5, 1., rainAmount)*2.;
    float layer1 = S(.25, .75, rainAmount);
    float layer2 = S(.0, .5, rainAmount);
    
    vec2 c = Drops(uv, t, staticDrops, layer1, layer2);

    // 根据是否定义了CHEAP_NORMALS宏选择不同的方式计算法线向量n
    #ifdef CHEAP_NORMALS
        vec2 n = vec2(dFdx(c.x), dFdy(c.x));// cheap normals (3x cheaper, but 2 times shittier ;))
    #else
        vec2 e = vec2(.001, 0.);
        float cx = Drops(uv+e, t, staticDrops, layer1, layer2).x;
        float cy = Drops(uv+e.yx, t, staticDrops, layer1, layer2).x;
        vec2 n = vec2(cx-c.x, cy-c.x);		// expensive normals
    #endif
    
    // 如果已定义HAS_HEART宏，则根据T的值调整法线向量n和y分量，并加入到颜色值c中。
    #ifdef HAS_HEART
    n *= 1.-S(60., 85., T);
    c.y *= 1.-S(80., 100., T)*.8;
    #endif
    
    // 在纹理坐标UV+n处，从iChannel0中获取一个颜色值col，并根据focus值使用textureLod函数进行采样。
    float focus = mix(maxBlur-c.y, minBlur, S(.1, .2, c.x));
    vec3 col = textureLod(iChannel0, UV+n, focus).rgb;
    
    // 如果定义了USE_POST_PROCESSING宏，则计算colFade、fade、lightning等参数，并将其用于后处理。否则，直接输出颜色值。
    #ifdef USE_POST_PROCESSING
    t = (T+3.)*.5;										// make time sync with first lightnoing
    float colFade = sin(t*.2)*.5+.5+story;
    col *= mix(vec3(1.), vec3(.8, .9, 1.3), colFade);	// subtle color shift
    float fade = S(0., 10., T);							// fade in at the start
    float lightning = sin(t*sin(t*10.));				// lighting flicker
    lightning *= pow(max(0., sin(t+sin(t))), 10.);		// lightning flash
    col *= 1.+lightning*fade*mix(1., .1, story*story);	// composite lightning
    col *= 1.-dot(UV-=.5, UV);							// vignette
    											
    #ifdef HAS_HEART
    	col = mix(pow(col, vec3(1.2)), col, heart);
    	fade *= S(102., 97., T);
    #endif
    
    col *= fade;										// composite start and end fade
    #endif
    
    //col = vec3(heart);
    fragColor = vec4(col, 1.);
}
