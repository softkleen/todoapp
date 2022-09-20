import { Component } from '@angular/core';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { async } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
tarefas: any[]=[]; // matriz tarefas (nome, feito )
  constructor(
    private alertCtrl: AlertController,
    private toasCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController
  ) {
    // carregando tarefas a partir do localStorage
    let tarefaJson = localStorage.getItem('tarefaDb');
    if(tarefaJson != null){
      this.tarefas = JSON.parse(tarefaJson);
    }
  }
async addTarefa(){
  const alerta = await this.alertCtrl.create({
    header:'O que você precisa fazer?',
    inputs:[
      {name:'txtnome', type:'text',placeholder:'digite aqui...'}
    ],
    buttons:[
      {text:'Cancelar', role:'cancel', cssClass:'light',
      handler:()=>{
        // comandos executados caso o usuário clique em cancelar
        console.log('Você cancelou...');
      }},
      {text:'Ok', 
        handler:(form)=>{
          //console.log(form)
          this.add(form.txtnome);
        }
      }
    ]
  });
  alerta.present();
}
async add(nova:any){
  if(nova.trim().length < 1){
    const toast = await this.toasCtrl.create({
      message: 'Informe o que precisa fazer',
      duration: 2000,
      position:'middle',
      color: 'warning'
    });
    toast.present();
  }else{
    let tarefa = {nome: nova, feito:false}
    this.tarefas.push(tarefa);
    // armazenando no celular...
    this.atualizaLocalStorage(); 
    const toast = await this.toasCtrl.create({
      message: 'Tarefa adicionada com sucesso',
      duration: 2000,
      position:'middle',
      color: 'success'
    });
    toast.present();
  }
}
async abrirOpcoes(tarefa:any){
  const actsheet = await this.actionSheetCtrl.create({
    header:'Escolha uma ação',
    buttons:[
      {
        text:tarefa.feito?'Desmarcar':'Marcar',
        icon:tarefa.feito?'radio-button-off':'checkmark-circle',
        handler:()=>{
          tarefa.feito=!tarefa.feito;
          this.atualizaLocalStorage(); 
        }
      },
      {
        text:'Cancelar',
        icon:'close',
        role:'cancel',
        handler:()=>{}
      }
    ]
  });
  actsheet.present();
}
excluir(tarefa:any){
  this.tarefas = this.tarefas.filter(res => tarefa != res);
  this.atualizaLocalStorage(); 
}
atualizaLocalStorage(){
  localStorage.setItem('tarefaDb',JSON.stringify(this.tarefas));
}


}
