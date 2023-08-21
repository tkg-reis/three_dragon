import './style.css'
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger"


const canvas = document.querySelector("#webgl");

let scene, camera, renderer, done, model, mixer, drache;

// three.js
let rot = 0;
{
    function init() {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1, 
            1000
        );
        camera.position.set(1,2,1);

        // contact
        const btn = document.querySelector('#check');
        console.log(btn);
        done = false;
        btn.addEventListener('click', () => {
            if(!gsap.isTweening(camera.position)) {
                gsap.to(camera.position, {
                    z: done ? 20 : 12,
                    y: done ? 2 : 17,
                    x: done ? 1 : 7
                })
                done = !done;
            }
        });
        const textureLoader = new THREE.TextureLoader();
        const bgTexture = textureLoader.load("./bg.jpg");
        scene.background = bgTexture;

        const gltfLoader = new GLTFLoader();
        drache = gltfLoader.load("./scene.gltf",(gltf) => {
            model = gltf.scene;
            model.scale.set(3, 3, 3);
            model.position.set(1,1,1);
            scene.add(model);
            drache = true;
            mixer = new THREE.AnimationMixer(model);
            // console.log(mixer);
            const clips = gltf.animations;
            // console.log(clips);
            clips.forEach((clip) => {
                const action = mixer.clipAction(clip);
                action.play();
            })
        });
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(1,2,3);
        scene.add(pointLight);

        const fog = new THREE.Fog("#262837" , 50 ,100);
        scene.fog = fog;
        
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
        });
        renderer.setSize(window.innerWidth , window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        window.addEventListener("resize", onWindowResize);
        
        animate();
    }
    init();  
    function animate() {
        if(mixer) {
            mixer.update(0.055);
        }
        function radianPlusCamera(Xposi, Zposi) {
            rot += 0.05;
            const radian = (rot * Math.PI) / 180;
            camera.position.x = Xposi * Math.sin(radian);
            camera.position.z = Zposi * Math.cos(radian);
        }
        if(!done) {
            radianPlusCamera(30, 25);
        }
        scene.add(camera);
        if(drache) {
            camera.lookAt(0,3,0);
        }
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    function onWindowResize() {
        console.log(window.innerWidth);
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
}

// gsap

{
    // loading animation
    let bars;
    // let W = window.innerWidth;
    // console.log(W);
    function makeFrag() {
        for(let i = 0; i < 200; i++){
            bars = document.createElement('span');
            document.querySelector('.loading').appendChild(bars);
        }
        let loadSpans = document.querySelectorAll('.loading span');
        gsap.from(loadSpans, {
            y: "-100%",
            delay: 1,
            stagger: {
                from: "random",
                amount: 10,
            },
            onComplete :() => {
                gsapAnimation();
            }
        })
    }
    window.addEventListener('load', () => {
        makeFrag();
        webStorage();
        setTimeout(()=>{
            const loadSec = document.querySelector('.loading_section');
            loadSec.style.visibility = "hidden";
            document.documentElement.style.overflowY = "scroll";
        },15000);
    });
    function webStorage() {
        if (sessionStorage.getItem('access')) {
            document.querySelector('.loading_section').style.visibility = "hidden";
            window.document.querySelector('html').style.overflowY = "scroll";
        } else{
            sessionStorage.setItem('access', 0);
        }
    };

    // top animation
    function gsapAnimation () {
        gsap.registerPlugin(ScrollTrigger);
        let h1 = document.querySelector('.first');
        let sec1 = document.querySelector('.sec_1');
        let text = sec1.textContent;
        let chars = text.trim().split('');
        let newArray = chars.reduce((accu, curr) => {
            return `${accu}<span>${curr}</span>`
        },"");
        sec1.innerHTML = newArray;
        let spans = document.querySelectorAll('.sec_1 span');
        spans.forEach((splitText, index) => {
        gsap.fromTo(
        splitText,
        {
            y:400,
            autoAlpha: 0,
        },
        {
            y:0,
            autoAlpha:1,
            duration: sessionStorage.getItem('access') ? 1 : 7,
            delay : 0.1 * index,
            onComplete : () => {
                setInterval(() => {
                    splitText.style.fontSize = Math.floor(Math.random() * 40) + 16 + "px";
                },2000);
            },
            scrollTrigger: {
                trigger: ".first",
                start: "top center",
                end: "top end",
            },
            stagger: {
                each: 0.5 * index,
                from: "random",
            },
        }
        );
        });
        gsap.fromTo(
            h1,
            {
                x:-200,
                autoAlpha: 0,
            },
            {
                x:0,
                autoAlpha:1,
                duration: sessionStorage.getItem('access') ? 1 : 7,
            }
        );
    };

    // works
    let worksH2 = document.querySelector('.works h2');
    let wordsText = worksH2.textContent;
    let wordsTextAraay = wordsText.trim().split('');
    let newTextArray = wordsTextAraay.reduce((accu, curr) => {
        return `${accu}<span data-char="">${curr}</span>`
    },"");
    worksH2.innerHTML = newTextArray;
    let Strings = "Hi! Thank_you_watching_my_portfolio";
    let worksCharsAttribute = document.querySelectorAll('.works h2 span[data-char]');
    worksCharsAttribute.forEach((newSpan, index) => {
        newSpan.setAttribute("data-char", Strings[index]);
    });    
    let tl = gsap.timeline();
    tl.set(worksCharsAttribute, {
        y: -110,
    })
    tl.set(worksH2, {
        autoAlpha: 1,
    })
    tl.to(worksCharsAttribute, {
        duration: 1,
        y: 0,
        stagger : {
            each: 0.3,
        },
    }).to(worksCharsAttribute, {
        duration: 1,
        y: 110,
        repeat:-1,
        yoyo: true,
        stagger: {
            each: 0.3,
        }
    });
    window.addEventListener('load', () => {
        gsap.registerPlugin(ScrollTrigger);

        const trigger = document.querySelector('.works')
        const wrap = document.querySelector('.wrap');
        const boxes = document.querySelectorAll('.box');
        const boxLeng = boxes.length;
        
        let width = window.innerWidth;
        let setWidth = 720;
        gsap.set(wrap, {
            width: boxLeng * 100 + "%",
            x: width > setWidth ? 500 : 0
        });
        
        gsap.set(boxes, {
            width: "240px",
            height: "288px",
        })
        
        let gtl = gsap.timeline();
        gtl.to(boxes, {
            xPercent: -50 * (boxLeng - 0.05),
            ease: "none",
            scrollTrigger: {
                trigger: trigger,
                start: width > setWidth ? "top 0%" : "top 55%",
                end: "+=100",
                pin: true,
                scrub: .6,
                // markers: true,
            }
        })
    });

    // skills
    let skillsModule = document.querySelectorAll('.gsap_module');
    let skillsModuleArray = gsap.utils.toArray(skillsModule);
    gsap.registerPlugin(ScrollTrigger);
    skillsModuleArray.forEach(skillModuleArr=> {
        gsap.set(skillModuleArr, {
            x:200,
        });
    })
    ScrollTrigger.create({
        trigger: skillsModuleArray[0],
        start: "top center",
        end: "bottom center",
        scrub: -1,
        toggleActions: "restart none reverse none",
        toggleClass: "is_active",
        onEnter: () => {
            gsap.to(skillsModuleArray[0], {
                scale: 1.3,
                opacity: 1,
            });
        },
        onLeave:() => {
            gsap.to(skillsModuleArray[0], {
                scale:1,
                opacity: 0.6,
            })
        }
    })
    ScrollTrigger.create({
        trigger: skillsModuleArray[1],
        start: "top center",
        end: "bottom center",
        scrub: -1,
        toggleActions: "restart none reverse none",
        toggleClass: "is_active",
        onEnter: () => {
            gsap.to(skillsModuleArray[1], {
                scale: 1.3,
                opacity: 1,
            });
        },
        onLeave:() => {
            gsap.to(skillsModuleArray[1], {
                scale:1,
                opacity: 0.6,
            })
        }
    })
    ScrollTrigger.create({
        trigger: skillsModuleArray[2],
        start: "top center",
        end: "bottom center",
        scrub: -1,
        toggleActions: "restart none reverse none",
        toggleClass: "is_active",
        onEnter: () => {
            gsap.to(skillsModuleArray[2], {
                scale: 1.3,
                opacity: 1,
            });
        },
        onLeave:() => {
            gsap.to(skillsModuleArray[2], {
                scale:1,
                opacity: 0.6,
            })
        }
    })
    ScrollTrigger.create({
        trigger: skillsModuleArray[3],
        start: "top center",
        end: "bottom center",
        scrub: -1,
        toggleActions: "restart none reverse none",
        toggleClass: "is_active",
        onEnter: () => {
            gsap.to(skillsModuleArray[3], {
                scale: 1.3,
                opacity: 1,
            });
        },
        onLeave:() => {
            gsap.to(skillsModuleArray[3], {
                scale:1,
                opacity: 0.6,
            })
        }
    })
    ScrollTrigger.create({
        trigger: skillsModuleArray[4],
        start: "top center",
        end: "bottom center",
        scrub: -1,
        toggleActions: "restart none reverse none",
        toggleClass: "is_active",
        onEnter: () => {
            gsap.to(skillsModuleArray[4], {
                scale: 1.3,
                opacity: 1,
            });
        },
        onLeave:() => {
            gsap.to(skillsModuleArray[4], {
                scale:1,
                opacity: 0.6,
            })
        }
    })

    // dream
    let PDream = document.querySelector('.dream p'),
        PDreamSplit = PDream.textContent.split('');
    PDream.textContent = ""
    let outputPDream = ""
    PDreamSplit.forEach(dream => {
        outputPDream += `<span>${dream}</span>`
    });
    PDream.innerHTML = outputPDream;
    let target = document.querySelectorAll('.dream p span');
    target.forEach((el,index) => {
        gsap.registerPlugin(ScrollTrigger);
        function getRandomColor() {

            let letters = '0123456789ABCDEF';
            let color = '#';
        
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
                }
            return color;
        }
        gsap.set(el, {
            autoAlpha: 0,
            color: getRandomColor(),
        })
        gsap.to(el, {
            autoAlpha: 1,
            duration: 5,
            delay: index * 0.1,
            onComplete: () => {
                setInterval(() => {
                    el.style.color = getRandomColor();
                },2000);
            },
            scrollTrigger: {
                trigger: PDream,
                start: "center center",
                end : "+=100",
                // markers: true
            },
            stagger: {
                from: "random",
                amount: 10,
            }
        })
    });

    // sns
    let snsLinks = gsap.utils.toArray('.sns_link'),
        snsContainer = document.querySelector('.sns_container'),
        snsItem = document.querySelector('.sns_wrapper img');
    function moveSns(e) {
        let mouseX = e.clientX;
        let mouseY = e.clientY;
        tl = gsap.timeline();
        tl.to(snsContainer, {
            duration: 1,
            x: mouseX,
            y: mouseY,
        })
    }

    function linkHover(e) {
        if(e.type === "mouseenter") {
            let svgSrc = e.target.dataset.src;
            gsap.registerPlugin(ScrollTrigger);
            let tl = gsap.timeline();

            tl.set(snsItem, {
                attr: {
                    src: svgSrc
                }
            }).to(snsItem, {
                scrollTrigger : {
                    trigger: ".sns h2",
                    start: "top 20%",
                    end: "bottom", 
                    onEnter: () => {
                        snsContainer.classList.add("is_active");
                    },
                    onLeave: () => {
                        snsContainer.classList.remove("is_active");
                    },
                },
                autoAlpha: 1,
                scale: 1,
            });
        } else if(e.type === "mouseleave") {
            let tl = gsap.timeline();
            tl.to(snsItem , {
                scrollTrigger : {
                    trigger: ".sns h2",
                    start: "top 20%",
                    end: "bottom", 
                },
                autoAlpha: 0 ,
                scale:.3,
            })
        }
    }

    function initAnimation() {
        snsLinks.forEach((link) => {
            link.addEventListener('mouseleave', linkHover, false);
            link.addEventListener('mouseenter', linkHover , false);
            link.addEventListener("mousemove" , moveSns ,false);
        })
    }

    function initSnsAnimation() {
        initAnimation();
    }

    window.addEventListener('load', () => {
        initSnsAnimation();
    })

}

{
    const viewport = document.querySelector('meta[name="viewport"]');
    function switchViewport() {
        const value =
            window.outerWidth > 1280
            ? 'width=device-width,initial-scale=1'
            : 'width=1280';
        if (viewport.getAttribute('content') !== value) {
            viewport.setAttribute('content', value);
        }
    }
    addEventListener('load', switchViewport, false);
    switchViewport();
}

// スマホサイズは省く
// 普通に生きたい
// 自分の普通・幸せを考える
// 普通の基準
// モデルを見つける
// 問題解決能力