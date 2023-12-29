import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fabric } from 'fabric';
import { UserService } from '../Utils/Services/User.service';
import { IllustrationService } from '../Utils/Services/Illustration.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../Utils/Services/Shared.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, AfterViewInit {

  constructor(
    private userService: UserService,
    private illusService: IllustrationService,
    private share: SharedService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) { }
  user: any;
  categories: string[] = [
    "Biology",
    "Geology",
    "Mechanics",
    "Electrical",
    "Computer_Science",
    "Physics",
    "Chemistry"];
  languages: string[] = [
    "ENGLISH",
    "FRENCH",
    "SPANISH",
    "GERMAN",
    "ITALIAN",
    "PORTUGUESE",
    "DUTCH",
    "RUSSIAN",
    "CHINESE",
    "JAPANESE",
    "ARABIC",
    "HINDI",
    "BENGALI",
    "URDU",
    "PERSIAN",
    "TURKISH",
    "KOREAN"
  ];
  @ViewChild('canvaParent') canvaParent!: ElementRef;
  @ViewChild('canvas') canvasRef!: ElementRef;
  private canvas!: fabric.Canvas;
  private selectedImage: fabric.Image | null = null;
  private selectedTextZone: fabric.Rect | null = null;
  emptyFile!: File;
  illustrationFile!: File;
  finishedFileUrl: string = "";
  errMessage: string = "";
  id_illus: number = 0;
  illus: any;
  showSpinner: boolean = false;

  myForm = this.fb.group({
    name: ['', Validators.required],
    language: ['', Validators.required],
    description: ['', [Validators.required, Validators.maxLength(1000), Validators.minLength(130)]],
    category: ['', Validators.required]
  });

  ngOnInit(): void {
    this.getUser();
    this.id_illus = Number(this.route.snapshot.paramMap.get('id'));
    this.getIllusById();
  }

  ngAfterViewInit() {
    this.canvas = new fabric.Canvas(this.canvasRef.nativeElement);
    this.canvas.setWidth(550);
    this.canvas.setHeight(350);

    // Add event listener for text zone selection
    this.canvas.on('object:selected', (event) => {
      const selectedObject = event.target?.type;
      console.log('Object selected:', selectedObject);

    });

    // Add event listener for text zone deselection
    this.canvas.on('selection:cleared', () => {
      console.log('Selection cleared');
      this.selectedTextZone = null;
    });
    this.setupCanvas();
  }

  getUser() {
    this.userService.getByUsername(this.userService.extractUsername()).subscribe((data: any) => {
      this.user = data;
      console.log(data)
    });
  }

  getIllusById() {
    if (this.id_illus) {
      this.illusService.getById(this.id_illus).subscribe((data: any) => {
        this.illus = data;
        this.languages.splice(this.languages.indexOf(this.illus.language), 1);
        this.myForm.patchValue({
          category: this.illus.category
        });
        this.illusService.fetchImage(this.illus.emptyIllustrationUrl).subscribe(data => {
          const url = URL.createObjectURL(data);
          this.addPicture(url);
        })
      })
    }
  }

  handleImageUpload(event: any) {
    const target = event.target as HTMLInputElement;
    const file = (target.files as FileList)[0];

    this.emptyFile = file;

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target!.result as string;
        this.addPicture(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  }

  selectedObject: any;

  addPicture(imageUrl: string) {
    fabric.Image.fromURL(imageUrl, (img) => {
      img.scale(0.5);
      this.canvas.clear();
      this.canvas.add(img);
      this.selectedImage = img;
      img.sendToBack();

      img.on('mousedown', (event) => {
        //this.handleTextZoneAddition(event.pointer!);
      });

      img.on('selected', (event) => {
        if (!this.illus) {
          console.log("img selected");
          this.selectedObject = event.target;
        }
      })
    });
  }

  sendToFront() {
    if (this.selectedObject) {
      this.selectedObject.bringToFront();
    }
  }

  handleTextZoneAddition(pointer: fabric.Point) {

    const { x, y } = pointer;
    const textZone = new fabric.IText("Write...", {
      left: x,
      top: y,
      width: 100,
      height: 50,
      fill: 'transparent',
      stroke: 'black',
      fontStyle: 'normal',
      strokeWidth: 2.5,
      selectable: true,
      cursorColor: 'black',
      borderColor: 'red'
    });

    textZone.on('selected', (event) => {
      this.selectedObject = event.target;
    })

    this.canvas.add(textZone);
    this.canvas.setActiveObject(textZone); // Select the added text zone

  }

  deleteSelectedObject() {
    if (this.selectedObject) {
      this.canvas.remove(this.selectedObject);
      this.selectedTextZone = null;
      this.selectedObject = null;
    }
  }

  selectTextZone() {
    if (this.selectedTextZone) {
      this.canvas.setActiveObject(this.selectedTextZone);
    }
  }

  addTextZone() {
    // Call the method to add a text zone
    this.handleTextZoneAddition(new fabric.Point(100, 100));
  }

  downloadCanvas() {
    if (this.canvas) {
      // Get the data URL of the canvas
      const dataUrl = this.canvas.toDataURL({
        format: 'png',
        quality: 1.0,
      });

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'canvas_image.png';

      // Trigger the download
      link.click();
    }
  }

  finishEditing() {
    // Get the data URL of the canvas
    const dataUrl = this.canvas.toDataURL({
      format: 'png',
      quality: 1.0,
    });

    this.finishedFileUrl = dataUrl;

    // Convert data URL to Blob
    const blob = this.dataURLtoBlob(dataUrl);

    // Create a File object from the Blob
    const file = new File([blob], 'illustration.png');

    this.illustrationFile = file;

    // Now, you can use the 'file' object as needed
    console.log('File object:', file);
  }

  private dataURLtoBlob(dataURL: string): Blob {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }

  saveIllus() {
    this.showSpinner = true;
    if (this.myForm.valid && this.emptyFile && this.illustrationFile) {
      const formData = new FormData();
      formData.append("emptyFile", this.emptyFile);
      formData.append("fullFile", this.illustrationFile);
      formData.append("name", this.myForm.value.name!);
      formData.append("description", this.myForm.value.description!);
      formData.append("language", this.myForm.value.language!);
      formData.append("category", this.myForm.value.category!);
      this.illusService.addIllustration(formData, this.user.id_user).subscribe({
        next: (res: any) => {
          this.showSpinner = false;
          window.location.replace("/illus/details/" + res.id_illus);
        },
        error: (error) => {
          this.showSpinner = false;
          this.share.errorMessageObservable.subscribe(msg => this.errMessage = msg);
        }
      });
    } else {
      if (!this.illustrationFile || !this.emptyFile) {
        this.showSpinner = false;
        this.errMessage = "You need to finish your editing first!";
      } else
        if (this.myForm.get('description')?.hasError('minlength')) {
          this.showSpinner = false;
          this.errMessage = "Description should contain at least 130 characters"
        } else if (this.myForm.get('description')?.hasError('maxlength')) {
          this.showSpinner = false;
          this.errMessage = "The description is too long. It should not exceed 1000 characters"
        } else {
          this.showSpinner = false;
          this.errMessage = "All fields are required.";
        }
    }
  }

  addTranslation() {
    if (this.illustrationFile && this.myForm.valid) {
      const formData = new FormData();
      formData.append("fullFile", this.illustrationFile);
      formData.append("name", this.myForm.value.name!);
      formData.append("description", this.myForm.value.description!);
      formData.append("language", this.myForm.value.language!);
      this.illusService.addTranslation(formData, this.user.id_user, this.id_illus).subscribe({
        next: (res: any) => {
          window.location.replace("/illus/details/" + res.id_illus);
        },
        error: () => {
          this.share.errorMessageObservable.subscribe(msg => this.errMessage = msg);
        }
      });
    } else {
      if (!this.illustrationFile || !this.emptyFile) {
        this.showSpinner = false;
        this.errMessage = "You need to finish your editing first!";
      } else
        if (this.myForm.get('description')?.hasError('minlength')) {
          this.showSpinner = false;
          this.errMessage = "Description should contain at least 130 characters"
        } else if (this.myForm.get('description')?.hasError('maxlength')) {
          this.showSpinner = false;
          this.errMessage = "The description is too long. It should not exceed 1000 characters"
        } else {
          this.showSpinner = false;
          this.errMessage = "All fields are required.";
        }
    }
  }

  private setupCanvas(): void {
    this.canvas.on('mouse:down', (event) => this.handleMouseDown(event));
    this.canvas.on('mouse:move', (event) => this.handleMouseMove(event));
    this.canvas.on('mouse:up', () => this.handleMouseUp());
  }

  isDrawing: boolean = false;
  private line: fabric.Line | null = null;


  startDrawing(): void {
    this.setupCanvas();
    this.isDrawing = true;
  }

  private handleMouseDown(event: fabric.IEvent): void {
    if (!this.isDrawing) {
      return;
    }

    const pointer = this.canvas.getPointer(event.e);


    // Start drawing a line
    this.line = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
      stroke: 'black',
      strokeWidth: 2,
      selectable: true, // Allow line selection
      evented: true, // Allow events on the line
    });


    this.line.on("selected", (event) => {
      this.selectedObject = event.target;
    });

    this.canvas.add(this.line);
  }

  private handleMouseMove(event: fabric.IEvent): void {
    if (!this.isDrawing) {
      return;
    }

    const pointer = this.canvas.getPointer(event.e);

    // Update the line as the mouse moves
    this.line!.set({ x2: pointer.x, y2: pointer.y });

    this.canvas.renderAll();
  }

  private handleMouseUp(): void {
    this.isDrawing = false;
    this.line = null;
  }
}


