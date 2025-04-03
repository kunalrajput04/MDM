import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-element',
  templateUrl: './dialog-element.component.html',
  styleUrls: ['./dialog-element.component.css']
})
export class DialogElementComponent implements OnInit {
  viewTableData:any;
  constructor(@Optional() public dialogRef: MatDialogRef<DialogElementComponent>,
  @Inject(MAT_DIALOG_DATA) public dialogData: any) { }

  ngOnInit(): void {
    console.log(this.dialogData);
    this.viewTableData=this.dialogData;
  }

}
