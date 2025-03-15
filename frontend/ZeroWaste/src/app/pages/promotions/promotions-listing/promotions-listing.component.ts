import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { ButtonComponent } from '../../../components/form/button/button.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Promotion } from '../promotion';
import { PromotionService } from '../../../services/PromotionService';
import { ModalComponent } from "../../../components/modal/modal.component";
import { CardComponent, CardHeaderComponent, CardContentComponent, CardFooterComponent } from "../../../components/card/card.component";
import { InputComponent } from "../../../components/form/input/input.component";
import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { ValidationErrorMessage } from '../../../services/ValidationErrorMessage';
import { UserPayload } from '../../../auth/auth.service';

@Component({
  selector: 'app-promotions-listing',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonComponent,
    RouterModule,
    ModalComponent,
    CardComponent,
    CardHeaderComponent,
    CardContentComponent,
    CardFooterComponent,
    InputComponent,
  ],
  templateUrl: './promotions-listing.component.html',
  styleUrl: './promotions-listing.component.css'
})

export class PromotionsListingComponent implements OnInit {
  public promotionService: PromotionService = inject(PromotionService);
  public fb = inject(FormBuilder);
  private validationErrorMessage = inject(ValidationErrorMessage);
  public route = inject(ActivatedRoute);
  public promotions = signal<Promotion[]>([]);
  public filters = this.fb.group({
    percentage: [null, Validators.min(0)],
  });
  @ViewChild(ModalComponent) modal!: ModalComponent;

  public async ngOnInit(): Promise<void> {
    const promotions = await this.promotionService.getAllPromotions();
    this.promotions.set(promotions);
  }

  public async onSubmitFilterForm(event: SubmitEvent) {
    event.preventDefault();

    if (this.filters.invalid) {
      return;
    }

    try {
      const percentage = this.filters.get('percentage')?.value;
      const filteredPromotions = await this.promotionService.getPromotionByPercentage(percentage);
      this.promotions.set(filteredPromotions);
    } catch (error) {
      console.error('Erro ao buscar promoções', error);
      alert('Erro ao buscar promoções');
    }
  }

  public async onDeletePromotionConfirmation(id: number): Promise<void> {
    const user: UserPayload = JSON.parse(localStorage.getItem('user')!);

    if (user.role !== 'ADMIN') {
      alert('Você não tem permissão para deletar promoções');

      this.modal.closeModal();

      return;
    }

    try {
      await this.promotionService.deletePromotion(id);

      alert('Promoção deletada com sucesso!');

      this.promotions.set(this.promotions().filter((promotion) => promotion.id !== id));
    } catch (error) {
      if ((error as Error).cause) {
        const { message } = (error as Error).cause as any;

        alert('Erro ao deletar promoção: ' + message);
      }
    }
  }

  public getErrorMessage(controlName: string): string | null {
    const validationErrorMessage = this.validationErrorMessage.getValidationErrorMessage(this.filters.get(controlName)!);

    return validationErrorMessage;
  }
  
} 

